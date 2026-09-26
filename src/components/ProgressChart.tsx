import { GRADE_BANDS, predictGrade, type FinnishGrade } from '../data/grade'

// Placeholder trend until real per-session history exists (no time-series
// tracking yet — engagement only knows "now"). Illustrates the intended
// visual with an example series that climbs into the M band, so the chart
// can be reviewed before wiring it to real data later.
const EXAMPLE_SERIES = [20, 27, 33, 40, 47, 53, 60, 66]

const TIER_STROKE: Record<FinnishGrade['tier'], string> = {
  high: 'stroke-good',
  mid: 'stroke-accent',
  low: 'stroke-bad',
}
const TIER_FILL: Record<FinnishGrade['tier'], string> = {
  high: 'fill-good',
  mid: 'fill-accent',
  low: 'fill-bad',
}
const TIER_BAND_FILL: Record<FinnishGrade['tier'], string> = {
  high: 'fill-good/10',
  mid: 'fill-accent/10',
  low: 'fill-bad/10',
}

const WIDTH = 300
const HEIGHT = 170
const PAD_LEFT = 24
const PAD_RIGHT = 8
const PAD_TOP = 12
const PAD_BOTTOM = 24
const PLOT_WIDTH = WIDTH - PAD_LEFT - PAD_RIGHT
const PLOT_HEIGHT = HEIGHT - PAD_TOP - PAD_BOTTOM

function yFor(pct: number) {
  return PAD_TOP + PLOT_HEIGHT * (1 - pct / 100)
}

function xFor(index: number, count: number) {
  return PAD_LEFT + (index / (count - 1)) * PLOT_WIDTH
}

export default function ProgressChart() {
  const series = EXAMPLE_SERIES
  const lastPct = series[series.length - 1]
  const currentGrade = predictGrade(lastPct)

  const bandIndex = GRADE_BANDS.findIndex((b) => b.grade.letter === currentGrade.letter)
  const bandTop = bandIndex > 0 ? GRADE_BANDS[bandIndex - 1].min : 100
  const bandBottom = GRADE_BANDS[bandIndex].min

  const points = series.map((pct, i) => `${xFor(i, series.length)},${yFor(pct)}`).join(' ')

  return (
    <div className="mb-6 rounded-2xl border border-ink/10 bg-surface p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">Edistyminen ajan mittaan</span>
        <span className="text-[11px] font-medium text-ink-dim/70">Esimerkkidata</span>
      </div>
      <p className="mb-2 text-xs text-ink-dim">
        Suunta kohti tasoa {currentGrade.letter} ({currentGrade.name}).
      </p>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full">
        <rect
          x={PAD_LEFT}
          y={yFor(bandTop)}
          width={PLOT_WIDTH}
          height={yFor(bandBottom) - yFor(bandTop)}
          className={TIER_BAND_FILL[currentGrade.tier]}
        />

        {GRADE_BANDS.filter((b) => b.min > 0).map((b) => (
          <g key={b.grade.letter}>
            <line
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={yFor(b.min)}
              y2={yFor(b.min)}
              strokeWidth={1}
              strokeDasharray="3 3"
              className="stroke-ink/10"
            />
            <text
              x={PAD_LEFT - 6}
              y={yFor(b.min)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-ink-dim/60 text-[8px]"
            >
              {b.grade.letter}
            </text>
          </g>
        ))}

        <polyline
          points={points}
          fill="none"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={TIER_STROKE[currentGrade.tier]}
        />

        {series.map((pct, i) => (
          <circle
            key={i}
            cx={xFor(i, series.length)}
            cy={yFor(pct)}
            r={i === series.length - 1 ? 4 : 2.5}
            className={TIER_FILL[currentGrade.tier]}
          />
        ))}

        <text x={PAD_LEFT} y={HEIGHT - 6} textAnchor="start" className="fill-ink-dim/60 text-[9px]">
          8 vk sitten
        </text>
        <text x={WIDTH - PAD_RIGHT} y={HEIGHT - 6} textAnchor="end" className="fill-ink-dim/60 text-[9px]">
          Nyt
        </text>
      </svg>
    </div>
  )
}
