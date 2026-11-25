import { useMemo, useState } from 'react'
import { EXAM_MAX_POINTS, GRADE_BANDS, pointsToPct, predictGrade, type FinnishGrade } from '../data/grade'
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
  RELIABILITY_LEVELS,
  TASK_WEIGHT,
  type EstimateReliability,
  type OverallEstimate,
  type KnowledgeState,
} from '../data/knowledge'
import { getCheckpointProgress, usePointsTotal } from '../data/points'
import { PointsStar } from './PointsMeter'
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
}

const TIER_CLASSES: Record<FinnishGrade['tier'], { badge: string; text: string; tint: string; bar: string }> = {
  high: { badge: 'bg-good/15 text-good ring-good/30', text: 'text-good', tint: 'bg-good/15', bar: 'bg-good' },
  mid: { badge: 'bg-accent/15 text-accent ring-accent/30', text: 'text-accent', tint: 'bg-accent/15', bar: 'bg-accent' },
  low: { badge: 'bg-bad/15 text-bad ring-bad/30', text: 'text-bad', tint: 'bg-bad/15', bar: 'bg-bad' },
}

// Ennustettu arvosana as a grade scale: the exam's grade bands from I to L
// side by side, each as wide as its share of the points, filled up to the
// student's kokonaisosaaminen. A "Sinä" pin marks where they are and a
// flag where the target grade starts, so the gap to it reads at a glance.
const BANDS_LOW_TO_HIGH = GRADE_BANDS.map((band, i) => ({
  ...band,
  max: i === 0 ? 100 : GRADE_BANDS[i - 1].min,
})).reverse()

// Keeps a label centred on `pct` without letting it leave the scale.
function clampedLeft(pct: number, margin: string): string {
  return `min(max(${pct}%, ${margin}), calc(100% - ${margin}))`
}

function GradeScale({
  pct,
  grade,
  target,
  targetPct,
  large,
}: {
  pct: number
  grade: FinnishGrade
  target: FinnishGrade
  targetPct: number
  large: boolean
}) {
  const classes = TIER_CLASSES[grade.tier]
  return (
    <div className="w-full select-none">
      {/* "Sinä" pin over the scale. */}
      <div className={`relative ${large ? 'h-9' : 'h-8'}`}>
        <span
          className="absolute bottom-1 flex -translate-x-1/2 flex-col items-center transition-[left] duration-700"
          style={{ left: clampedLeft(pct, '1.75rem') }}
        >
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold text-white ${classes.bar}`}>
            Sinä {pct} %
          </span>
        </span>
        <span
          aria-hidden
          className={`absolute bottom-0 h-1.5 w-0.5 -translate-x-1/2 rounded-full transition-[left] duration-700 ${classes.bar}`}
          style={{ left: `${pct}%` }}
        />
      </div>

      <div className={`relative ${large ? 'h-5' : 'h-4'}`}>
        {/* The bands, tinted by tier. */}
        <div className="absolute inset-0 flex gap-0.5 overflow-hidden rounded-full">
          {BANDS_LOW_TO_HIGH.map((band) => (
            <span
              key={band.grade.letter}
              className={TIER_CLASSES[band.grade.tier].tint}
              style={{ width: `${band.max - band.min}%` }}
            />
          ))}
        </div>
        {/* Filled up to the student's level. */}
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ${classes.bar}`}
          style={{ width: `${pct}%`, minWidth: pct > 0 ? '0.5rem' : 0 }}
        />
        {/* Band edges stay visible over the fill. */}
        {BANDS_LOW_TO_HIGH.slice(1).map((band) => (
          <span
            key={band.grade.letter}
            aria-hidden
            className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-surface"
            style={{ left: `${band.min}%` }}
          />
        ))}
        {/* Where the target grade starts. */}
        <span
          aria-hidden
          className="absolute -bottom-1 -top-1 w-[3px] -translate-x-1/2 rounded-full bg-ink ring-2 ring-surface"
          style={{ left: `${targetPct}%` }}
        />
      </div>

      {/* Band letters, the predicted one highlighted. */}
      <div className="relative mt-1.5 h-5">
        {BANDS_LOW_TO_HIGH.map((band) => {
          const current = band.grade.letter === grade.letter
          return (
            <span
              key={band.grade.letter}
              className={`absolute -translate-x-1/2 text-xs ${
                current ? `font-bold ${TIER_CLASSES[band.grade.tier].text}` : 'font-semibold text-ink-dim/60'
              }`}
              style={{ left: `${(band.min + band.max) / 2}%` }}
            >
              {band.grade.letter}
            </span>
          )
        })}
      </div>

      {/* The target flag under the letters. */}
      <div className="relative h-6">
        <span
          className="absolute top-0.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold text-white"
          style={{ left: clampedLeft(targetPct, '2.75rem') }}
        >
          Tavoite {target.letter}
        </span>
      </div>
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
    <span className="mt-2 inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-surface-2 px-3 py-1 text-xs ring-1 ring-ink/10">
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

// Points earned from exercises and the way to the next välietappi.
function CheckpointProgressRow() {
  const total = usePointsTotal()
  const cp = getCheckpointProgress(total)
  return (
    <div className="mt-5 w-full rounded-2xl bg-surface-2 p-3 text-left ring-1 ring-ink/5" data-onboarding="checkpoints">
      <div className="flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-good text-white">
            <PointsStar className="h-3.5 w-3.5" />
          </span>
          Pisteet ja välietapit
        </span>
        <span className="text-xs font-semibold text-ink">
          {total} p · {cp.reachedCount} {cp.reachedCount === 1 ? 'etappi' : 'etappia'}
        </span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-good transition-[width] duration-700"
          style={{ width: `${Math.round(cp.progress * 100)}%` }}
        />
      </div>
      <span className="mt-1.5 block text-xs text-ink-dim">
        {cp.next
          ? `${cp.toNext} p seuraavaan välietappiin (${cp.next.points} p). Pisteitä saa oikeista vastauksista.`
          : 'Kaikki välietapit saavutettu!'}
      </span>
    </div>
  )
}

export default function Osaaminen({
  targetGrade,
  onTargetGradeChange,
  courseGrades,
  onCourseGradeChange,
  knowledge,
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
          <span className="font-semibold text-ink">Lähtötaso</span> tulee esitiedoista: kurssin
          lukioarvosana (paino {FALLBACK_PRIOR_WEIGHT}).
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
              {/* On laptops the grade centres in the card's height, leaving
                  Välietapit and Tavoitearvosana at the bottom. */}
              <div className={`mt-4 flex flex-col ${isDesktop ? 'flex-1 justify-center' : ''}`}>
                <div className="flex items-center gap-4">
                  <span
                    className={`flex shrink-0 items-center justify-center rounded-2xl font-bold ring-2 ${tierClasses.badge} ${
                      isDesktop ? 'h-24 w-24 text-5xl' : 'h-16 w-16 text-4xl'
                    }`}
                  >
                    {grade.letter}
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className={`font-bold leading-tight ${tierClasses.text} ${isDesktop ? 'text-2xl' : 'text-lg'}`}>
                      {grade.name}
                    </span>
                    <span className="mt-0.5 text-sm font-semibold text-ink-dim">{overallPct} % kokonaisosaaminen</span>
                    {!overall.hasData && (
                      <span className="mt-1 text-xs text-ink-dim">Täytä esitiedot tai vastaa tehtäviin</span>
                    )}
                  </div>
                </div>
                {overall.hasData && (
                  <div className="mt-1">
                    <ReliabilityFlag overall={overall} />
                  </div>
                )}
                <div className={isDesktop ? 'mt-8' : 'mt-5'}>
                  <GradeScale pct={overallPct} grade={grade} target={target} targetPct={targetPct} large={isDesktop} />
                </div>
              </div>

              <CheckpointProgressRow />

              <button
                type="button"
                onClick={() => setTargetOpen(true)}
                aria-haspopup="dialog"
                aria-label="Muuta tavoitearvosanaa"
                data-onboarding="target-grade"
                className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-surface-2 p-3 text-left ring-1 ring-transparent transition-colors hover:bg-accent/10 hover:ring-accent/30 active:ring-accent/40"
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
