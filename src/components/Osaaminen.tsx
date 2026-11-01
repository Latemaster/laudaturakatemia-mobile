import { useMemo, useState } from 'react'
import { EXAM_MAX_POINTS, pointsToPct, predictGrade, type FinnishGrade } from '../data/grade'
import {
  getFinnishGrade,
  getTargetPoints,
  saveTargetGrade,
  type TargetGrade,
} from '../data/studyPlans'
import type { CourseGrade, CourseGrades } from '../data/courseGrades'
import {
  computeKnowledge,
  EXERCISE_WEIGHT,
  FALLBACK_PRIOR_WEIGHT,
  POLL_PRIOR_WEIGHT,
  RELIABILITY_LEVELS,
  TASK_WEIGHT,
  type EstimateReliability,
  type OverallEstimate,
  type KnowledgeState,
  type PollLevel,
} from '../data/knowledge'
import type { ThemeId } from '../data/themes'
import CourseGradesSection from './CourseGradesSection'
import InfoToggle, { InfoPanel } from './InfoToggle'
import ProgressChart from './ProgressChart'
import TargetGradeView from './TargetGradeView'
import type { TopicCode } from '../types'
import PageContainer from './PageContainer'
import { useLayout } from '../layout/LayoutContext'

interface OsaaminenProps {
  targetGrade: TargetGrade
  onTargetGradeChange: (grade: TargetGrade) => void
  courseGrades: CourseGrades
  onCourseGradeChange: (code: TopicCode, grade: CourseGrade | undefined) => void
  knowledge: KnowledgeState
  onPollChange: (themeId: ThemeId, level: PollLevel | undefined) => void
}

const TIER_CLASSES: Record<FinnishGrade['tier'], { badge: string; text: string; stroke: string; bar: string }> = {
  high: { badge: 'bg-good/15 text-good ring-good/30', text: 'text-good', stroke: 'stroke-good', bar: 'bg-good' },
  mid: { badge: 'bg-accent/15 text-accent ring-accent/30', text: 'text-accent', stroke: 'stroke-accent', bar: 'bg-accent' },
  low: { badge: 'bg-bad/15 text-bad ring-bad/30', text: 'text-bad', stroke: 'stroke-bad', bar: 'bg-bad' },
}

// The donut's diameter in px: larger on laptops, where it heads the page.
const DONUT_SIZE_PHONE = 136
const DONUT_SIZE_LAPTOP = 184

function GradeDonut({
  pct,
  grade,
  targetPct,
  size,
}: {
  pct: number
  grade: FinnishGrade
  targetPct: number
  size: number
}) {
  const stroke = Math.round(size / 12)
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  // The grade letter's disc fills the ring's inside, less a small gap.
  const disc = Math.round((radius - stroke / 2 - 6) * 2)
  const tierClasses = TIER_CLASSES[grade.tier]
  const offset = circumference * (1 - pct / 100)
  // The svg is rotated -90deg so the arc starts at 12 o'clock; the tick is
  // placed in the unrotated frame and rotates along with it.
  const targetAngle = (targetPct / 100) * 2 * Math.PI
  const tickInner = radius - stroke / 2 - 3
  const tickOuter = radius + stroke / 2 + 3
  const tick = {
    x1: size / 2 + tickInner * Math.cos(targetAngle),
    y1: size / 2 + tickInner * Math.sin(targetAngle),
    x2: size / 2 + tickOuter * Math.cos(targetAngle),
    y2: size / 2 + tickOuter * Math.sin(targetAngle),
  }

  return (
    <div className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="fill-none stroke-ink/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`fill-none transition-all duration-500 ${tierClasses.stroke}`}
        />
        <line
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          strokeWidth={3}
          strokeLinecap="round"
          className="stroke-accent"
        />
      </svg>
      <span
        className={`absolute flex items-center justify-center rounded-full font-bold ring-2 ${tierClasses.badge}`}
        style={{ width: disc, height: disc, fontSize: disc * 0.45 }}
      >
        {grade.letter}
      </span>
    </div>
  )
}

const RELIABILITY_CLASSES: Record<EstimateReliability, { text: string; bar: string; filled: number }> = {
  epävarma: { text: 'text-bad', bar: 'bg-bad', filled: 1 },
  kohtuullinen: { text: 'text-accent', bar: 'bg-accent', filled: 2 },
  hyvä: { text: 'text-good', bar: 'bg-good', filled: 3 },
}

// Three-step flag under the donut: how much of kokonaisosaaminen rests on
// exercise answers rather than esitiedot.
function ReliabilityFlag({ overall }: { overall: OverallEstimate }) {
  const { reliability, exerciseShare } = overall
  const classes = RELIABILITY_CLASSES[reliability.reliability]
  return (
    <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-xs ring-1 ring-ink/10">
      <span aria-hidden className="flex gap-0.5">
        {[1, 2, 3].map((step) => (
          <span key={step} className={`h-2.5 w-1.5 rounded-full ${step <= classes.filled ? classes.bar : 'bg-ink/15'}`} />
        ))}
      </span>
      <span className={`font-semibold ${classes.text}`}>{reliability.label}</span>
      <span className="text-ink-dim">· {Math.round(exerciseShare * 100)} % tehtävistä</span>
    </span>
  )
}

export default function Osaaminen({
  targetGrade,
  onTargetGradeChange,
  courseGrades,
  onCourseGradeChange,
  knowledge,
  onPollChange,
}: OsaaminenProps) {
  const { isDesktop } = useLayout()
  const [targetOpen, setTargetOpen] = useState(false)
  const scores = useMemo(() => computeKnowledge(knowledge, courseGrades), [knowledge, courseGrades])

  const { overall } = scores
  const overallPct = overall.pct
  const grade = predictGrade(overallPct)
  const tierClasses = TIER_CLASSES[grade.tier]
  const target = getFinnishGrade(targetGrade)
  const targetTierClasses = TIER_CLASSES[target.tier]
  const targetPoints = getTargetPoints(targetGrade)
  const targetPct = pointsToPct(targetPoints.avg)

  // On laptops an open explanation takes its card's place (scrolling
  // inside it), so the page still fits without scrolling.
  const [forecastInfoOpen, setForecastInfoOpen] = useState(false)
  const [esitiedotInfoOpen, setEsitiedotInfoOpen] = useState(false)

  const forecastInfo = (
    <>
      <p className="mb-2">
        Kokonaisosaaminen lasketaan teemoittain. Jokaisen teeman arvio on painotettu keskiarvo
        lähtötasosta ja tehtävien vastauksista:
      </p>
      <ul className="mb-2 flex list-disc flex-col gap-1 pl-4">
        <li>
          <span className="font-semibold text-ink">Lähtötaso</span> tulee esitiedoista: esikyselyn
          vastaus (paino {POLL_PRIOR_WEIGHT}) tai, jos teemaan ei ole vastattu, kurssiarvosana (paino{' '}
          {FALLBACK_PRIOR_WEIGHT}).
        </li>
        <li>
          <span className="font-semibold text-ink">Tehtävät</span>: vain ensimmäinen vastaus kuhunkin
          tehtävään lasketaan. Pikatehtävä painaa {EXERCISE_WEIGHT}, avoin tehtävä {TASK_WEIGHT.easy}–
          {TASK_WEIGHT.hard} vaikeuden mukaan. Täyden painon saa vain oikea vastaus, joten yksi
          epäonnistunut vaikea tehtävä ei kumoa perusteiden osaamista.
        </li>
        <li>
          Kurssin arvio on sen teemojen keskiarvo ja kokonaisosaaminen kurssien keskiarvo. Teema, josta ei
          ole esitietoja eikä vastauksia, lasketaan nollaksi.
        </li>
      </ul>
      <p className="mb-2">
        Ennustettu arvosana saadaan vertaamalla kokonaisosaamista yo-kokeen tyypillisiin pisterajoihin
        jaettuna kokeen {EXAM_MAX_POINTS} pisteellä.
      </p>
      <p className="mb-2">
        Esitiedot ovat heikkoa näyttöä, joten arviolle näytetään luotettavuus sen mukaan, kuinka suuri osa
        siitä perustuu tehtävien vastauksiin:
      </p>
      <ul className="flex flex-col gap-1">
        {[...RELIABILITY_LEVELS].reverse().map((band, index, bands) => {
          const next = bands[index + 1]
          const range = next
            ? `${index === 0 ? 'alle ' : `${Math.round(band.min * 100)}–`}${Math.round(next.min * 100)} %`
            : `vähintään ${Math.round(band.min * 100)} %`
          return (
            <li key={band.reliability}>
              <span className={`font-semibold ${RELIABILITY_CLASSES[band.reliability].text}`}>
                {band.label}
              </span>{' '}
              = {range} tehtävistä
            </li>
          )
        })}
      </ul>
    </>
  )

  function handleTargetChange(next: TargetGrade) {
    onTargetGradeChange(next)
    saveTargetGrade(next)
  }

  return (
    <PageContainer full>
      <h1 className="mb-1 text-2xl font-bold text-ink">Osaaminen</h1>
      <p className="mb-6 text-sm text-ink-dim">Ennuste ja edistyminen tällä istunnolla.</p>

      {/* Laptops: Ennustettu arvosana on the left; Edistyminen ajan mittaan
          and Osaaminen esitiedot share the right column, the chart taking
          what esitiedot leaves, so the page fits without scrolling. Phones
          stack all three. */}
      <div className={isDesktop ? 'grid min-h-[30rem] flex-1 grid-cols-2 items-stretch gap-6 [&>*]:mb-0' : ''}>
        <div
          className={`mb-6 rounded-3xl border border-ink/10 bg-surface p-6 shadow-sm ${
            isDesktop ? 'flex min-h-0 flex-col' : ''
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">
              Ennustettu arvosana
            </span>
            <InfoToggle
              label="Miten ennuste lasketaan"
              open={forecastInfoOpen}
              onOpenChange={setForecastInfoOpen}
              inline={!isDesktop}
            >
              {forecastInfo}
            </InfoToggle>
          </div>

          {isDesktop && forecastInfoOpen ? (
            <InfoPanel className="mt-3 min-h-0 flex-1 overflow-y-auto">{forecastInfo}</InfoPanel>
          ) : (
            <>
              {/* On laptops the donut centres in the card's height, leaving
                  Tavoitearvosana at the bottom, level with esitiedot. */}
              <div className={`mt-3 flex flex-col items-center text-center ${isDesktop ? 'flex-1 justify-center' : ''}`}>
                <GradeDonut
                  pct={overallPct}
                  grade={grade}
                  targetPct={targetPct}
                  size={isDesktop ? DONUT_SIZE_LAPTOP : DONUT_SIZE_PHONE}
                />
                <span className={`mt-3 text-base font-semibold ${tierClasses.text}`}>Arvosana {grade.letter}</span>
                <span className="mt-1 text-sm font-semibold text-ink-dim">{overallPct} % kokonaisosaaminen</span>
                {overall.hasData ? (
                  <ReliabilityFlag overall={overall} />
                ) : (
                  <span className="mt-1 text-xs text-ink-dim">Täytä esitiedot tai vastaa tehtäviin</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setTargetOpen(true)}
                aria-haspopup="dialog"
                aria-label="Muuta tavoitearvosanaa"
                className="mt-5 flex w-full items-center gap-3 rounded-2xl bg-surface-2 p-3 text-left ring-1 ring-transparent transition-colors hover:bg-accent/10 hover:ring-accent/30 active:ring-accent/40"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ring-2 ${targetTierClasses.badge}`}
                >
                  {target.letter}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">
                    Tavoitearvosana
                  </span>
                  <span className="text-sm font-semibold text-ink">
                    Aiemmin tarvitut pisteet: {targetPoints.avg} / {EXAM_MAX_POINTS} p.
                  </span>
                </div>
              </button>
            </>
          )}
        </div>

        <div className={isDesktop ? 'flex min-h-0 flex-col gap-6 [&>*]:mb-0' : ''}>
          {/* Esitiedot's explanation is longer than its card, so it takes
              the chart's room too while open. */}
          {!(isDesktop && esitiedotInfoOpen) && (
            <div className={isDesktop ? 'min-h-0 flex-1' : ''}>
              <ProgressChart targetLetter={target.letter} targetPct={targetPct} fill={isDesktop} />
            </div>
          )}
          <CourseGradesSection
            courseGrades={courseGrades}
            onCourseGradeChange={onCourseGradeChange}
            polls={knowledge.polls}
            onPollChange={onPollChange}
            infoOpen={esitiedotInfoOpen}
            onInfoOpenChange={setEsitiedotInfoOpen}
          />
        </div>
      </div>

      {targetOpen && (
        <TargetGradeView
          targetGrade={targetGrade}
          onTargetGradeChange={handleTargetChange}
          onClose={() => setTargetOpen(false)}
        />
      )}
    </PageContainer>
  )
}
