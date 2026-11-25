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
  RELIABILITY_LEVELS,
  TASK_WEIGHT,
  type EstimateReliability,
  type OverallEstimate,
  type KnowledgeState,
} from '../data/knowledge'
import { getCheckpointProgress, usePointsTotal } from '../data/points'
import ActivityRings, { RING_COLORS, useRingsState } from './ActivityRings'
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

const TIER_CLASSES: Record<FinnishGrade['tier'], { badge: string; text: string; bar: string }> = {
  high: { badge: 'bg-good/15 text-good ring-good/30', text: 'text-good', bar: 'bg-good' },
  mid: { badge: 'bg-accent/15 text-accent ring-accent/30', text: 'text-accent', bar: 'bg-accent' },
  low: { badge: 'bg-bad/15 text-bad ring-bad/30', text: 'text-bad', bar: 'bg-bad' },
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

// One ring's line in the legend beside the rings.
function RingLegend({ color, title, value, note }: { color: string; title: string; value: string; note?: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <div className="flex min-w-0 flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">{title}</span>
        <span className="text-base font-bold leading-tight text-ink">{value}</span>
        {note && <span className="text-xs text-ink-dim">{note}</span>}
      </div>
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
  const outerRing = targetPct > 0 ? overallPct / targetPct : 0
  const pointsTotal = usePointsTotal()
  const checkpoint = getCheckpointProgress(pointsTotal)
  const rings = useRingsState()

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
              {/* The activity rings, as in the top bar: outer = the way to
                  the target grade, inner = the way to the next välietappi,
                  the predicted grade in the middle. On laptops they centre
                  in the card's height, leaving Tavoitearvosana at the
                  bottom. */}
              <div
                className={`mt-4 flex ${
                  isDesktop ? 'flex-1 flex-row items-center justify-center gap-10' : 'flex-col items-center gap-5'
                }`}
              >
                <ActivityRings
                  size={isDesktop ? 200 : 168}
                  stroke={isDesktop ? 22 : 19}
                  outer={outerRing}
                  state={rings}
                  popOnPoints={false}
                  center={
                    <span className="flex flex-col items-center leading-none">
                      <span className={`font-bold ${tierClasses.text} ${isDesktop ? 'text-5xl' : 'text-4xl'}`}>
                        {grade.letter}
                      </span>
                      <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-ink-dim/70">
                        ennuste
                      </span>
                    </span>
                  }
                />
                <div className={`flex min-w-0 flex-col gap-4 ${isDesktop ? '' : 'w-full'}`}>
                  <div className="flex flex-col">
                    <span className={`font-bold leading-tight ${tierClasses.text} ${isDesktop ? 'text-xl' : 'text-lg'}`}>
                      {grade.name}
                    </span>
                    <span className="mt-0.5 text-sm font-semibold text-ink-dim">{overallPct} % kokonaisosaaminen</span>
                    {overall.hasData ? (
                      <ReliabilityFlag overall={overall} />
                    ) : (
                      <span className="mt-1 text-xs text-ink-dim">Täytä esitiedot tai vastaa tehtäviin</span>
                    )}
                  </div>
                  <div className={isDesktop ? 'flex flex-col gap-3' : 'grid grid-cols-2 gap-3'}>
                    <RingLegend
                      color={RING_COLORS.outer.stroke}
                      title={`Tavoite ${target.letter}`}
                      value={`${Math.round(Math.min(1, outerRing) * 100)} %`}
                      note={outerRing >= 1 ? 'Tavoite saavutettu!' : `${overallPct} / ${targetPct} %`}
                    />
                    <RingLegend
                      color={RING_COLORS.inner.stroke}
                      title={checkpoint.next ? `Välietappi ${checkpoint.next.number}` : 'Välietapit'}
                      value={checkpoint.next ? `${checkpoint.toNext} p jäljellä` : 'Kaikki saavutettu'}
                      note={`${pointsTotal} p kerätty oikeista vastauksista`}
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTargetOpen(true)}
                aria-haspopup="dialog"
                aria-label="Muuta tavoitearvosanaa"
                data-onboarding="target-grade"
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
              <ProgressChart targetGrade={targetGrade} fill={isDesktop} />
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
