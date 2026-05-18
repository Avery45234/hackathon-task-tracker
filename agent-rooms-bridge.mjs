#!/usr/bin/env node
// agent-rooms bridge
//
// Connects your local machine to an agent-rooms room and routes prompts for
// one seat through a local coding-agent CLI (claude, codex, …) so the agent
// runs under YOUR subscription / login on YOUR machine.
//
// Usage: node agent-rooms-bridge.mjs <ticket>
//
// Requires Node 22+ for the built-in WebSocket client.

import { spawn } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs/promises'
import os from 'node:os'

const NODE_MAJOR = Number(process.versions.node.split('.')[0])
if (typeof WebSocket === 'undefined' || NODE_MAJOR < 22) {
  console.error(`This bridge requires Node 22 or newer (you have ${process.version}).`)
  console.error('Install the current LTS from https://nodejs.org and run again.')
  process.exit(1)
}

const ticketArg = process.argv[2]
if (!ticketArg) {
  console.error('usage: node agent-rooms-bridge.mjs <ticket>')
  process.exit(1)
}

let ticket
try {
  ticket = JSON.parse(Buffer.from(ticketArg, 'base64').toString('utf8'))
} catch {
  console.error('Could not decode ticket. Copy it directly from the agent-rooms UI.')
  process.exit(1)
}

const { server, room, seat, token, cli } = ticket
if (!server || !room || !seat || !token || !cli) {
  console.error('Ticket is missing fields. Re-copy it from the agent-rooms UI.')
  process.exit(1)
}

const CLI_RUNNERS = {
  claude: {
    cmd: process.platform === 'win32' ? 'claude.cmd' : 'claude',
    args: (prompt) => ['-p', prompt, '--dangerously-skip-permissions'],
    installHint: 'npm install -g @anthropic-ai/claude-code  (then run `claude` once to sign in)',
  },
  codex: {
    cmd: process.platform === 'win32' ? 'codex.cmd' : 'codex',
    args: (prompt) => ['exec', '--full-auto', prompt],
    installHint: 'npm install -g @openai/codex  (then run `codex` once to sign in)',
  },
}

const runner = CLI_RUNNERS[cli]
if (!runner) {
  console.error(`Unknown CLI in ticket: "${cli}". This bridge only supports: ${Object.keys(CLI_RUNNERS).join(', ')}`)
  process.exit(1)
}

const wsUrl = server.replace(/^http/, 'ws') + '/ws'
const workspaceDir = path.join(os.homedir(), '.agent-rooms', 'workspaces', room)
await fs.mkdir(workspaceDir, { recursive: true })

console.log(`bridge: connecting to ${server}`)
console.log(`bridge: workspace ${workspaceDir}`)
console.log(`bridge: cli ${runner.cmd}`)

let ws = null
let reconnectTimer = null
let reconnectDelay = 1000

function connect() {
  ws = new WebSocket(wsUrl)
  ws.addEventListener('open', () => {
    reconnectDelay = 1000
    console.log('bridge: connected, sending ticket…')
    ws.send(JSON.stringify({ type: 'bridgeConnect', ticket: ticketArg }))
  })
  ws.addEventListener('message', async (ev) => {
    let msg
    try {
      msg = JSON.parse(ev.data)
    } catch {
      return
    }
    try {
      await onServerMessage(msg)
    } catch (err) {
      console.error('bridge: error handling message', err)
    }
  })
  ws.addEventListener('close', () => {
    console.error(`bridge: disconnected, reconnecting in ${reconnectDelay / 1000}s…`)
    reconnectTimer = setTimeout(connect, reconnectDelay)
    reconnectDelay = Math.min(reconnectDelay * 2, 30000)
  })
  ws.addEventListener('error', (err) => {
    console.error('bridge: ws error', err?.message || err)
  })
}

function safePath(rel) {
  const abs = path.normalize(path.join(workspaceDir, rel))
  if (!abs.startsWith(workspaceDir)) throw new Error(`escapes workspace: ${rel}`)
  return abs
}

async function onServerMessage(msg) {
  switch (msg.type) {
    case 'bridgeReady':
      console.log(`bridge: online for seat "${msg.seatName}" in room "${msg.roomName}" (cli=${msg.bridgeCli})`)
      break
    case 'snapshot':
      await applySnapshot(msg.files)
      console.log(`bridge: workspace synced (${Object.keys(msg.files).length} files)`)
      break
    case 'fileUpdate':
      await writeFile(msg.path, msg.content)
      break
    case 'fileDeleted':
      await deleteFile(msg.path)
      break
    case 'runPrompt':
      await runPrompt(msg.requestId, msg.prompt)
      break
    case 'error':
      console.error('bridge: server error —', msg.message)
      break
  }
}

async function applySnapshot(files) {
  await fs.rm(workspaceDir, { recursive: true, force: true })
  await fs.mkdir(workspaceDir, { recursive: true })
  for (const [rel, content] of Object.entries(files)) {
    await writeFile(rel, content)
  }
}

async function writeFile(rel, content) {
  const abs = safePath(rel)
  await fs.mkdir(path.dirname(abs), { recursive: true })
  await fs.writeFile(abs, content)
}

async function deleteFile(rel) {
  const abs = safePath(rel)
  await fs.rm(abs, { force: true })
}

async function snapshot() {
  const out = {}
  async function walk(dir) {
    let entries
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      const abs = path.join(dir, e.name)
      if (e.isDirectory()) {
        if (e.name === 'node_modules' || e.name.startsWith('.')) continue
        await walk(abs)
      } else {
        const rel = path.relative(workspaceDir, abs).replaceAll('\\', '/')
        try {
          out[rel] = await fs.readFile(abs, 'utf8')
        } catch {}
      }
    }
  }
  await walk(workspaceDir)
  return out
}

async function runPrompt(requestId, prompt) {
  const short = prompt.length > 80 ? prompt.slice(0, 80) + '…' : prompt
  console.log(`bridge: > ${short}`)
  const before = await snapshot()

  let stdout = ''
  let stderr = ''

  try {
    await new Promise((resolve, reject) => {
      let proc
      try {
        proc = spawn(runner.cmd, runner.args(prompt), {
          cwd: workspaceDir,
          stdio: ['ignore', 'pipe', 'pipe'],
        })
      } catch (err) {
        return reject(err)
      }
      proc.stdout.on('data', (d) => {
        stdout += d.toString()
      })
      proc.stderr.on('data', (d) => {
        stderr += d.toString()
      })
      proc.on('error', (err) => {
        if (err.code === 'ENOENT') {
          reject(new Error(`\`${runner.cmd}\` not found on this machine. Install it: ${runner.installHint}`))
        } else {
          reject(err)
        }
      })
      proc.on('exit', (code) => {
        if (code === 0) resolve()
        else reject(new Error(`${runner.cmd} exited ${code}: ${(stderr || stdout).trim().slice(0, 400)}`))
      })
    })
  } catch (err) {
    console.error(`bridge: < failed — ${err.message}`)
    return sendBridge({ type: 'result', requestId, error: err.message })
  }

  const after = await snapshot()
  const fileChanges = []
  for (const p of Object.keys(after)) {
    if (before[p] !== after[p]) fileChanges.push({ path: p, content: after[p] })
  }
  for (const p of Object.keys(before)) {
    if (!(p in after)) fileChanges.push({ path: p, deleted: true })
  }
  const summary = stdout.trim() || '(no text output)'
  console.log(`bridge: < done (${fileChanges.length} file change${fileChanges.length === 1 ? '' : 's'})`)
  sendBridge({ type: 'result', requestId, summary, fileChanges })
}

function sendBridge(msg) {
  if (ws?.readyState === 1) ws.send(JSON.stringify(msg))
}

connect()

const shutdown = () => {
  if (reconnectTimer) clearTimeout(reconnectTimer)
  if (ws && ws.readyState === 1) ws.close()
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
