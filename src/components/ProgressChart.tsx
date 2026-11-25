import { useMemo, useState } from 'react'
import { getWeeklyPoints, usePointsLog, WEEKLY_POINTS_GOAL, weekStart } from '../data/points'
import type { TargetGrade } from '../data/studyPlans'
import InfoToggle, { InfoPanel } from './InfoToggle'

// Edistyminen ajan mittaan: the student's points week by week (running
// total), against the target: a solid line across at the points for the
// target grade over the eight-week plan, and a staircase climbing to it,
// one step (WEEKLY_POINTS_GOAL) a week, showing where to be each week to
// stay on track.

// The plan's length; the chart always shows this many weeks.
const MIN_WEEKS = 8
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

const WIDTH = 300
const HEIGHT = 170
const PAD_LEFT = 12
const PAD_RIGHT = 10
const PAD_TOP = 20
const PAD_BOTTOM = 22
const PLOT_WIDTH = WIDTH - PAD_LEFT - PAD_RIGHT
const PLOT_HEIGHT = HEIGHT - PAD_TOP - PAD_BOTTOM

const ACTUAL = '#2f9e6e'
const PACE = '#5681bd'

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
    const actualMax = weeks[weeks.length - 1]?.cumulative ?? 0
    const target = goal * MIN_WEEKS
    const top = Math.max(target * 1.14, actualMax * 1.12)
    // Where the pace says the student should be by now, the current week
    // counted by how much of it has gone.
    const weekFraction = Math.min(1, (now - weekStart(now)) / WEEK_MS)
    const expectedNow = Math.min(target, Math.round(goal * (current - 1 + weekFraction)))
    return { weeks, current, slots, top, target, total: actualMax, expectedNow }
  }, [log, goal])

  const { weeks, current, slots, top, target, total, expectedNow } = chart
  const x = (week: number) => PAD_LEFT + ((week - slots[0]) / (slots.length - 1)) * PLOT_WIDTH
  const y = (points: number) => PAD_TOP + PLOT_HEIGHT * (1 - points / top)

  const shownWeeks = weeks.filter((w) => w.week >= slots[0])
  const actualPoints = shownWeeks.map((w) => `${x(w.week)},${y(w.cumulative)}`).join(' ')
  const area =
    shownWeeks.length > 1
      ? `M${x(shownWeeks[0].week)},${y(0)} L${actualPoints.replace(/ /g, ' L')} L${x(shownWeeks[shownWeeks.length - 1].week)},${y(0)} Z`
      : ''
  // The staircase: by the end of week w, `goal` * w points (capped at the
  // target). The step rises at week w's dot to that level and runs on to
  // the next week, so each dot sits against the top of its riser.
  const level = (week: number) => Math.min(target, goal * week)
  const stairs = slots
    .map((week, i) => {
      const rise = `${i === 0 ? 'M' : 'L'}${x(week)},${y(level(week - 1))} L${x(week)},${y(level(week))}`
      const next = slots[i + 1]
      return next ? `${rise} L${x(next)},${y(level(week))}` : rise
    })
    .join(' ')

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
        <span aria-hidden className="inline-block h-0.5 w-5 rounded-full" style={{ backgroundColor: PACE }} />
        Vaakaviiva = tavoite {targetGrade}: {target} p {MIN_WEEKS} viikossa
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden className="inline-block h-2 w-5 border-l border-t" style={{ borderColor: PACE }} />
        Portaat = tavoitetahti, {goal} p viikossa: missä pitäisi olla kunkin viikon lopussa
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

            <line
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={y(0)}
              y2={y(0)}
              strokeWidth={1}
              className="stroke-ink/20"
            />

            {/* Weekly steps towards the target. */}
            <path d={stairs} fill="none" stroke={PACE} strokeWidth={1.5} strokeOpacity={0.55} strokeLinejoin="round" />

            {/* The target, straight across. */}
            <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={y(target)} y2={y(target)} stroke={PACE} strokeWidth={1.75} />
            <rect x={PAD_LEFT} y={y(target) - 15} width={76} height={12} rx={6} fill={PACE} />
            <text
              x={PAD_LEFT + 38}
              y={y(target) - 9}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-white text-[7.5px] font-semibold"
            >
              Tavoite {targetGrade} · {target} p
            </text>

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
