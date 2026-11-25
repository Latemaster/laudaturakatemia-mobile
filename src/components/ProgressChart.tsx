import { useMemo, useState } from 'react'
import { getWeeklyPoints, usePointsLog, WEEKLY_POINTS_GOAL, weekStart } from '../data/points'
import type { TargetGrade } from '../data/studyPlans'
import InfoToggle, { InfoPanel } from './InfoToggle'

// Edistyminen ajan mittaan: the student's points week by week (running
// total), against the pace that keeps them on track for their target
// grade (WEEKLY_POINTS_GOAL a week, the dashed line).

const MIN_WEEKS = 8
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

const WIDTH = 300
const HEIGHT = 170
const PAD_LEFT = 30
const PAD_RIGHT = 10
const PAD_TOP = 16
const PAD_BOTTOM = 22
const PLOT_WIDTH = WIDTH - PAD_LEFT - PAD_RIGHT
const PLOT_HEIGHT = HEIGHT - PAD_TOP - PAD_BOTTOM

const ACTUAL = '#2f9e6e'
const PACE = '#5681bd'

// A round axis maximum and step: 1, 2 or 5 times a power of ten, in four
// steps or fewer.
function niceScale(max: number): { top: number; step: number } {
  const raw = Math.max(4, max) / 4
  const pow = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? 10 * pow
  return { top: Math.ceil(max / step) * step || step * 4, step }
}

interface ProgressChartProps {
  targetGrade: TargetGrade
  // Fills its container's height (beside the grade on laptops), the chart
  // growing into the room.
  fill?: boolean
}

export default function ProgressChart({ targetGrade, fill = false }: ProgressChartProps) {
  const log = usePointsLog()
  const goal = WEEKLY_POINTS_GOAL[targetGrade]
  const [infoOpen, setInfoOpen] = useState(false)

  const chart = useMemo(() => {
    const now = Date.now()
    const weeks = getWeeklyPoints(log, now)
    const current = weeks.length
    // Eight weeks from the first points; once past that, the last eight.
    const firstShown = Math.max(1, current - MIN_WEEKS + 1)
    const slots = Array.from({ length: MIN_WEEKS }, (_, i) => firstShown + i)
    const lastSlot = slots[slots.length - 1]
    const actualMax = weeks[weeks.length - 1]?.cumulative ?? 0
    const { top, step } = niceScale(Math.max(goal * lastSlot, actualMax) * 1.05)
    // Where the pace says the student should be by now, the current week
    // counted by how much of it has gone.
    const weekFraction = Math.min(1, (now - weekStart(now)) / WEEK_MS)
    const expectedNow = Math.round(goal * (current - 1 + weekFraction))
    return { weeks, current, slots, top, step, total: actualMax, expectedNow }
  }, [log, goal])

  const { weeks, current, slots, top, step, total, expectedNow } = chart
  const x = (week: number) => PAD_LEFT + ((week - slots[0]) / (slots.length - 1)) * PLOT_WIDTH
  const y = (points: number) => PAD_TOP + PLOT_HEIGHT * (1 - points / top)

  const shownWeeks = weeks.filter((w) => w.week >= slots[0])
  const actualPoints = shownWeeks.map((w) => `${x(w.week)},${y(w.cumulative)}`).join(' ')
  const area =
    shownWeeks.length > 1
      ? `M${x(shownWeeks[0].week)},${y(0)} L${actualPoints.replace(/ /g, ' L')} L${x(shownWeeks[shownWeeks.length - 1].week)},${y(0)} Z`
      : ''
  // The pace line: `goal` points a week, both lines read at each week's end.
  const paceFrom = { x: x(slots[0]), y: y(goal * slots[0]) }
  const paceTo = { x: x(slots[slots.length - 1]), y: y(goal * slots[slots.length - 1]) }

  const diff = total - expectedNow
  const status =
    total === 0
      ? 'Vastaa tehtäviin, niin pisteesi alkavat näkyä tässä.'
      : diff >= 0
        ? `Olet tahdissa: ${diff} p edellä tavoitetahtia.`
        : `${-diff} p jäljessä tavoitetahdista.`

  const legend = (
    <ul className="flex flex-col gap-1.5">
      <li className="flex items-center gap-2">
        <span aria-hidden className="inline-block h-0.5 w-5 rounded-full" style={{ backgroundColor: ACTUAL }} />
        Viiva = pisteesi yhteensä viikon lopussa; +luku = sillä viikolla saadut pisteet
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden className="inline-block h-0.5 w-5 border-t-2 border-dashed" style={{ borderColor: PACE }} />
        Katkoviiva = tavoitetahti {targetGrade}: {goal} p viikossa, jotta pysyt tavoitteessa
      </li>
      <li>Pisteitä saa oikeista pikatehtävistä (1 p) ja avointen tehtävien pisteytyksestä.</li>
    </ul>
  )

  return (
    <div
      className={`border border-ink/10 bg-surface shadow-sm ${
        fill ? 'flex h-full flex-col rounded-3xl p-6' : 'mb-6 rounded-2xl p-4'
      }`}
    >
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-ink">Edistyminen ajan mittaan</span>
        <InfoToggle label="Kaavion selite" open={infoOpen} onOpenChange={setInfoOpen} inline={!fill}>
          {legend}
        </InfoToggle>
      </div>
      {fill && infoOpen ? (
        <InfoPanel className="mt-2 min-h-0 flex-1 overflow-y-auto">{legend}</InfoPanel>
      ) : (
        <>
          <p className="mb-2 text-xs text-ink-dim">
            <span className="font-semibold text-ink">{total} p</span> · tavoitetahti {expectedNow} p tähän mennessä.{' '}
            <span className={total > 0 && diff >= 0 ? 'font-semibold text-good' : ''}>{status}</span>
          </p>
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={fill ? 'min-h-0 w-full flex-1' : 'w-full'}>
            <defs>
              <linearGradient id="progress-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACTUAL} stopOpacity={0.22} />
                <stop offset="100%" stopColor={ACTUAL} stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Points axis. */}
            {Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step).map((value) => (
              <g key={value}>
                <line
                  x1={PAD_LEFT}
                  x2={WIDTH - PAD_RIGHT}
                  y1={y(value)}
                  y2={y(value)}
                  strokeWidth={1}
                  strokeDasharray={value === 0 ? undefined : '3 3'}
                  className={value === 0 ? 'stroke-ink/20' : 'stroke-ink/10'}
                />
                <text
                  x={PAD_LEFT - 5}
                  y={y(value)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-ink-dim/70 text-[8px]"
                >
                  {value} p
                </text>
              </g>
            ))}

            {/* Tavoitetahti. */}
            <g>
              <line
                x1={paceFrom.x}
                y1={paceFrom.y}
                x2={paceTo.x}
                y2={paceTo.y}
                stroke={PACE}
                strokeWidth={1.5}
                strokeDasharray="5 3"
              />
            </g>
            <g>
              <rect x={paceTo.x - 62} y={paceTo.y - 16} width={62} height={12} rx={6} fill={PACE} />
              <text
                x={paceTo.x - 31}
                y={paceTo.y - 10}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-white text-[7.5px] font-semibold"
              >
                Tavoitetahti {targetGrade}
              </text>
            </g>

            {/* The student's points. */}
            {area && <path d={area} fill="url(#progress-area)" />}
            {shownWeeks.length > 1 && (
              <polyline
                points={actualPoints}
                fill="none"
                stroke={ACTUAL}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {shownWeeks.map((w) => (
              <g key={w.week}>
                <circle cx={x(w.week)} cy={y(w.cumulative)} r={w.week === current ? 4 : 2.75} fill={ACTUAL} />
                {w.points > 0 && (
                  <text
                    x={x(w.week)}
                    y={y(w.cumulative) - 7}
                    textAnchor="middle"
                    className="text-[7.5px] font-semibold"
                    fill={ACTUAL}
                    stroke="#ffffff"
                    strokeWidth={3}
                    strokeLinejoin="round"
                    style={{ paintOrder: 'stroke' }}
                  >
                    +{w.points}
                  </text>
                )}
              </g>
            ))}

            {slots.map((week) => (
              <text
                key={week}
                x={x(week)}
                y={HEIGHT - 6}
                textAnchor="middle"
                className={week === current ? 'fill-ink text-[8px] font-semibold' : 'fill-ink-dim/60 text-[8px]'}
              >
                {week === current ? 'tämä vk' : `vk ${week}`}
              </text>
            ))}
          </svg>
        </>
      )}
    </div>
  )
}
