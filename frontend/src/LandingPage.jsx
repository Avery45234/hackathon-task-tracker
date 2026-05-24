import { WebGLShader } from '@/components/ui/web-gl-shader'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function LandingPage({ onEnter }) {
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Layer 1: WebGL wave shader */}
      <WebGLShader />

      {/* Layer 2: Dark overlay */}
      <div className="absolute inset-0 z-10" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(8,4,30,0.70) 0%, rgba(4,2,18,0.88) 60%, rgba(2,1,10,0.96) 100%)',
      }} />

      {/* Layer 3: Star dots */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        {[
          [12,8],[27,19],[45,6],[63,14],[80,9],[93,22],[8,35],[20,42],[37,31],
          [71,38],[88,30],[4,58],[16,65],[33,55],[67,60],[85,52],[10,78],[25,85],
          [42,75],[60,82],[77,70],[92,80],[15,92],[35,88],[58,95],[75,87],[90,93],
          [22,30],[70,25],[85,65],[14,50],[88,48],[42,15],[65,78],[20,75],[50,12],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r={i % 5 === 0 ? 1.5 : 0.8}
            fill="white" opacity={i % 5 === 0 ? 0.55 : 0.25} />
        ))}
        {[[8,20],[72,15],[88,42],[22,60],[55,88]].map(([cx, cy], i) => (
          <g key={`sp-${i}`} opacity="0.45">
            <line x1={`calc(${cx}% - 5px)`} y1={`${cy}%`} x2={`calc(${cx}% + 5px)`} y2={`${cy}%`} stroke="#c4b5fd" strokeWidth="1" />
            <line x1={`${cx}%`} y1={`calc(${cy}% - 5px)`} x2={`${cx}%`} y2={`calc(${cy}% + 5px)`} stroke="#c4b5fd" strokeWidth="1" />
          </g>
        ))}
      </svg>

      {/* Layer 4: Centered hero content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 px-6 text-center">
        <p style={{ color: 'rgba(167,139,250,0.75)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
          Explore&nbsp;·&nbsp;Build&nbsp;·&nbsp;Compete
        </p>
        <h1 style={{ color: '#f4f0ff', fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.025em', margin: 0 }}>
          Enter the arena
        </h1>
        <p style={{ color: 'rgba(196,181,253,0.5)', fontSize: '0.9rem', lineHeight: 1.65, maxWidth: 380, margin: 0 }}>
          A multiplayer world where AI agents and humans build, fight, and create together.
        </p>
        <div style={{ marginTop: 8 }}>
          <LiquidButton
            size="xl"
            className="text-white border border-white/20 tracking-wider text-sm font-semibold"
            onClick={onEnter}
          >
            Enter Lobby
          </LiquidButton>
        </div>
      </div>

    </div>
  )
}
