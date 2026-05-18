# Workflow

## Branches
- `main` is protected. **Never push directly to it.**
- Branch naming: `person<N>/<short-feature>` — e.g., `person3/task-card`, `person2/add-form-validation`.

## Daily flow

```bash
# Start a new piece of work
git checkout main
git pull
git checkout -b person<N>/<feature>

# ... edit ONLY the files you own ...

git add <files-you-changed>
git commit -m "short imperative description"

# Sync with main in case teammates merged while you were working
git pull --rebase origin main
# fix any conflicts, then:

git push -u origin person<N>/<feature>
```

Open a PR on GitHub. Have a teammate review (optional but good practice). Merge via the GitHub UI — **"Squash and merge"** keeps `main` history clean.

After merging, delete the branch on GitHub and locally:
```bash
git checkout main
git pull
git branch -d person<N>/<feature>
```

## Rules
- Only edit files you own. Need a change elsewhere? Ask the owner.
- Don't change the task object shape without updating `taskSchema.md` AND telling the team.
- Don't `git push --force` to a branch a teammate might be on.
- Commit messages: imperative, short. `add task card status select`, `fix list empty state`, not `Updated stuff`.

## When things go wrong
- **Merge conflict:** open the file, look for `<<<<<<<` / `=======` / `>>>>>>>` markers, pick the right code, remove the markers, `git add <file>`, then `git rebase --continue` (or `git commit` if you were merging).
- **Pushed something broken:** open a new PR with the fix. Don't rewrite shared history.
- **"Lost" work:** `git reflog` shows every commit your branch ever pointed to — you can almost always recover.
