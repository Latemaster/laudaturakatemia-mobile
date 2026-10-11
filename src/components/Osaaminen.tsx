import { useMemo, useState } from 'react'
import { COURSES, COURSE_MAP } from '../data/courses'
import {
  DIFFICULTY_POINTS,
  getCourseDifficultyBreakdown,
  getCourseProgress,
  getTargetedCourseProgress,
  type Difficulty,
} from '../data/progress'
import { EXAM_MAX_POINTS, pointsToPct, predictGrade, type FinnishGrade } from '../data/grade'
import {
  getCourseTargets,
  getFinnishGrade,
  getTargetPoints,
  gradeRank,
  saveTargetGrade,
  type TargetGrade,
} from '../data/studyPlans'
import type { CourseGrade, CourseGrades } from '../data/courseGrades'
import {
  computeKnowledge,
  EXERCISE_WEIGHT,
  FALLBACK_PRIOR_WEIGHT,
  KNOWLEDGE_LEVELS,
  POLL_PRIOR_WEIGHT,
  RELIABILITY_LEVELS,
  TASK_WEIGHT,
  type EstimateReliability,
  type OverallEstimate,
  type CourseKnowledge,
  type KnowledgeState,
  type PollLevel,
  type ThemeScore,
} from '../data/knowledge'
import type { ThemeId } from '../data/themes'
import { ChevronDownIcon, ChevronRightIcon } from './icons'
import CourseGradesSection from './CourseGradesSection'
import InfoToggle from './InfoToggle'
import ProgressChart from './ProgressChart'
import TargetGradeView from './TargetGradeView'
import type { TopicCode } from '../types'

interface OsaaminenProps {
  engagedIds: Record<string, true>
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

// A theme with no poll answer and no attempts has nothing to colour; one
// with only a course grade behind it gets the same neutral treatment but
// shows its rough estimate (see ThemeRow).
const NO_DATA_BAR = 'bg-ink/20'

const DIFFICULTY_LABELS: { key: Difficulty; label: string; section: string }[] = [
  { key: 'easy', label: 'Helpot', section: 'Osa I' },
  { key: 'mid', label: 'Keskivaikeat', section: 'Osa II' },
  { key: 'hard', label: 'Vaikeat', section: 'Osa III–IV' },
]

function difficultyList(difficulties: Difficulty[]): string {
  const labels = DIFFICULTY_LABELS.filter((d) => difficulties.includes(d.key)).map((d) => d.label.toLowerCase())
  if (labels.length === 3) return 'kaikki tehtävät'
  return labels.join(' ja ')
}

const DONUT_SIZE = 104
const DONUT_STROKE = 8
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS

function GradeDonut({ pct, grade, targetPct }: { pct: number; grade: FinnishGrade; targetPct: number }) {
  const tierClasses = TIER_CLASSES[grade.tier]
  const offset = DONUT_CIRCUMFERENCE * (1 - pct / 100)
  // The svg is rotated -90deg so the arc starts at 12 o'clock; the tick is
  // placed in the unrotated frame and rotates along with it.
  const targetAngle = (targetPct / 100) * 2 * Math.PI
  const tickInner = DONUT_RADIUS - DONUT_STROKE / 2 - 3
  const tickOuter = DONUT_RADIUS + DONUT_STROKE / 2 + 3
  const tick = {
    x1: DONUT_SIZE / 2 + tickInner * Math.cos(targetAngle),
    y1: DONUT_SIZE / 2 + tickInner * Math.sin(targetAngle),
    x2: DONUT_SIZE / 2 + tickOuter * Math.cos(targetAngle),
    y2: DONUT_SIZE / 2 + tickOuter * Math.sin(targetAngle),
  }

  return (
    <div className="relative flex shrink-0 items-center justify-center" style={{ width: DONUT_SIZE, height: DONUT_SIZE }}>
      <svg width={DONUT_SIZE} height={DONUT_SIZE} className="-rotate-90 overflow-visible">
        <circle
          cx={DONUT_SIZE / 2}
          cy={DONUT_SIZE / 2}
          r={DONUT_RADIUS}
          strokeWidth={DONUT_STROKE}
          className="fill-none stroke-ink/10"
        />
        <circle
          cx={DONUT_SIZE / 2}
          cy={DONUT_SIZE / 2}
          r={DONUT_RADIUS}
          strokeWidth={DONUT_STROKE}
          strokeDasharray={DONUT_CIRCUMFERENCE}
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
        className={`absolute flex h-20 w-20 items-center justify-center rounded-full text-4xl font-bold ring-2 ${tierClasses.badge}`}
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

function answerCount(count: number): string {
  return count === 1 ? '1 vastaus' : `${count} vastausta`
}

// One theme of a course: name, score with its level, a bar in the level's
// colour and a line saying what the score rests on.
function ThemeRow({ score }: { score: ThemeScore }) {
  const { theme, pct, level, hasData, prior, attempts, confidence } = score
  const fromGrade = !hasData && prior.source === 'courseGrade'
  const tier = TIER_CLASSES[level.tier]

  let detail: string
  if (hasData && attempts === 0) {
    detail = 'Esikysely · tehtävien vastaukset tarkentavat arviota'
  } else if (hasData) {
    const parts = [answerCount(attempts)]
    if (prior.source === 'poll') parts.push('esikysely')
    if (confidence < 1) parts.push('arvio tarkentuu')
    detail = parts.join(' · ')
  } else if (fromGrade) {
    detail = 'Arvio kurssiarvosanan perusteella'
  } else {
    detail = 'Vastaa teeman tehtäviin Kurssit-välilehdellä'
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-2 text-xs">
        <span className="flex min-w-0 items-start gap-1.5 font-medium leading-snug text-ink">
          <span aria-hidden className={`mt-1 h-2 w-2 shrink-0 rounded-full ${hasData ? tier.bar : NO_DATA_BAR}`} />
          <span>{theme.name}</span>
        </span>
        <span className={`shrink-0 font-semibold ${hasData ? tier.text : 'text-ink-dim/70'}`}>
          {hasData ? `${pct} % · ${level.label}` : fromGrade ? `≈ ${pct} %` : 'ei tietoa'}
        </span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className={`h-full rounded-full transition-all duration-500 ${hasData ? tier.bar : NO_DATA_BAR}`}
          style={{ width: `${hasData || fromGrade ? pct : 0}%` }}
        />
      </div>
      <span className="mt-0.5 block text-[10px] text-ink-dim">{detail}</span>
    </div>
  )
}

// One segment per theme, coloured by its level, so the course's profile
// reads at a glance without expanding the row.
function ThemeStrip({ themes }: { themes: ThemeScore[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-ink-dim/70">Teemat</span>
      <div className="flex flex-1 gap-0.5" role="img" aria-label={`${themes.length} teemaa`}>
        {themes.map((score) => (
          <span
            key={score.theme.id}
            title={score.theme.name}
            className={`h-1.5 flex-1 rounded-full ${score.hasData ? TIER_CLASSES[score.level.tier].bar : NO_DATA_BAR}`}
          />
        ))}
      </div>
    </div>
  )
}

interface CourseRowProps {
  code: TopicCode
  engagedIds: Record<string, true>
  knowledge: CourseKnowledge
  // Difficulty tiers the target grade asks for; undefined when the course
  // is outside the plan and every tier is shown as untargeted.
  targeted?: Difficulty[]
  isExpanded: boolean
  onToggle: () => void
}

function CourseRow({ code, engagedIds, knowledge, targeted, isExpanded, onToggle }: CourseRowProps) {
  const course = COURSE_MAP[code]
  const inPlan = targeted !== undefined
  const { engaged, total, pct } = inPlan
    ? getTargetedCourseProgress(code, engagedIds, targeted)
    : getCourseProgress(code, engagedIds)
  const breakdown = getCourseDifficultyBreakdown(code, engagedIds)
  const knownThemes = knowledge.themes.filter((t) => t.hasData).length

  return (
    <div className={`rounded-2xl border border-ink/10 bg-surface p-3 shadow-sm ${inPlan ? '' : 'opacity-60'}`}>
      <button type="button" onClick={onToggle} className="flex w-full flex-col gap-1.5 text-left">
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${course.badgeClass}`}>
            {course.code}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-ink-dim">
              {engaged}/{total} · {pct} %
            </span>
            <ChevronDownIcon
              className={`h-3.5 w-3.5 text-ink-dim/70 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
        <span className="text-[11px] text-ink-dim">
          {inPlan ? `Tavoitteessa: ${difficultyList(targeted)}` : 'Ei tavoitteessa · kaikki tehtävät'}
        </span>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
          <div className={`h-full rounded-full ${course.barClass}`} style={{ width: `${pct}%` }} />
        </div>
        <ThemeStrip themes={knowledge.themes} />
      </button>

      {isExpanded && (
        <div className="mt-3 flex flex-col gap-3 border-t border-ink/10 pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-ink">Osaaminen teemoittain</span>
            <span className="text-ink-dim">
              {knownThemes > 0
                ? `${knownThemes}/${knowledge.themes.length} teemasta tietoa`
                : 'ei vielä vastauksia'}
            </span>
          </div>
          {knowledge.themes.map((score) => (
            <ThemeRow key={score.theme.id} score={score} />
          ))}

          <p className="border-t border-ink/10 pt-2 text-[11px] text-ink-dim">
            <span className="font-semibold">Tehtäviä käyty:</span>{' '}
            {DIFFICULTY_LABELS.map(({ key, label }, index) => {
              const stats = breakdown[key]
              const isTargeted = inPlan && targeted.includes(key)
              return (
                <span key={key} className={isTargeted || !inPlan ? '' : 'opacity-50'}>
                  {index > 0 && ' · '}
                  {label.toLowerCase()} {stats.engaged}/{stats.total}
                </span>
              )
            })}
          </p>
        </div>
      )}
    </div>
  )
}

export default function Osaaminen({
  engagedIds,
  targetGrade,
  onTargetGradeChange,
  courseGrades,
  onCourseGradeChange,
  knowledge,
  onPollChange,
}: OsaaminenProps) {
  const [expandedCourse, setExpandedCourse] = useState<TopicCode | null>(null)
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
  // Grades are ranked L=0 .. I=6, so a smaller rank is a better grade.
  const gradesToGo = gradeRank(grade.letter) - gradeRank(target.letter)

  const courseTargets = getCourseTargets(targetGrade)
  const inPlanCodes = new Set(courseTargets.map((t) => t.code))
  const otherCourses = COURSES.filter((course) => !inPlanCodes.has(course.code))

  function toggleCourse(code: TopicCode) {
    setExpandedCourse((prev) => (prev === code ? null : code))
  }

  function handleTargetChange(next: TargetGrade) {
    onTargetGradeChange(next)
    saveTargetGrade(next)
  }

  return (
    <div className="grid-bg h-dvh overflow-y-auto bg-page px-6 pb-10 pt-[calc(env(safe-area-inset-top)+4.5rem)]">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold text-ink">Osaaminen</h1>
        <p className="mb-6 text-sm text-ink-dim">Ennuste ja edistyminen tällä istunnolla.</p>

        <div className="mb-6 rounded-3xl border border-ink/10 bg-surface p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">
              Ennustettu arvosana
            </span>
            <InfoToggle label="Miten ennuste lasketaan">
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
            </InfoToggle>
          </div>

          <div className="mt-3 flex flex-col items-center text-center">
            <GradeDonut pct={overallPct} grade={grade} targetPct={targetPct} />
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
            className="mt-5 flex w-full items-center gap-3 rounded-2xl bg-surface-2 p-3 text-left ring-1 ring-transparent transition-colors active:ring-accent/40"
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
                {targetPoints.avg} / {EXAM_MAX_POINTS} p. · {targetPct} %
              </span>
              <span className="text-xs text-ink-dim">
                {gradesToGo <= 0
                  ? 'ennuste on tavoitteessa'
                  : `${gradesToGo} ${gradesToGo === 1 ? 'arvosana' : 'arvosanaa'} tavoitteeseen`}
              </span>
            </div>
            <span className="flex items-center gap-0.5 text-xs font-semibold text-accent">
              Muuta
              <ChevronRightIcon className="h-4 w-4" />
            </span>
          </button>
        </div>

        <CourseGradesSection
          courseGrades={courseGrades}
          onCourseGradeChange={onCourseGradeChange}
          polls={knowledge.polls}
          onPollChange={onPollChange}
        />

        <ProgressChart targetLetter={target.letter} targetPct={targetPct} />

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-ink">Kurssit tavoitteessa {target.letter}</h2>
          <InfoToggle label="Miten kurssien edistyminen lasketaan">
            <p className="mb-2">
              Kurssin prosentti lasketaan vain niistä tehtävistä, joita tavoitearvosanan lukusuunnitelma pyytää.
              Esimerkiksi jos tavoite pyytää MAA6:sta vain helpot tehtävät, prosentti kuvaa niiden edistymistä.
            </p>
            <ul className="mb-2 flex flex-col gap-1">
              {DIFFICULTY_LABELS.map(({ key, label, section }) => (
                <li key={key}>
                  <span className="font-semibold text-ink">{label}</span> = {section} · {DIFFICULTY_POINTS[key]} p. /
                  tehtävä
                </li>
              ))}
            </ul>
            <p className="mb-2">
              Teemat-rivi jakaa kurssin aihealueisiin. Jokaisella teemalla on oma osaamisarvio, joka perustuu
              vastattuihin pikatehtäviin: oikea vastaus nostaa, väärä laskee. Avaa kurssi nähdäksesi teemat.
            </p>
            <ul className="flex flex-col gap-1">
              {KNOWLEDGE_LEVELS.map((band) => (
                <li key={band.level} className="flex items-center gap-2">
                  <span aria-hidden className={`inline-block h-2 w-4 rounded-full ${TIER_CLASSES[band.tier].bar}`} />
                  <span className="font-semibold text-ink">{band.label}</span> = vähintään {Math.round(band.min * 100)} %
                </li>
              ))}
              <li className="flex items-center gap-2">
                <span aria-hidden className={`inline-block h-2 w-4 rounded-full ${NO_DATA_BAR}`} />
                Harmaa = ei vielä vastauksia
              </li>
            </ul>
          </InfoToggle>
        </div>

        <div className="flex flex-col gap-3">
          {courseTargets.map(({ code, difficulties }) => (
            <CourseRow
              key={code}
              code={code}
              engagedIds={engagedIds}
              knowledge={scores.courses[code]}
              targeted={difficulties}
              isExpanded={expandedCourse === code}
              onToggle={() => toggleCourse(code)}
            />
          ))}
        </div>

        {otherCourses.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-sm font-semibold text-ink-dim">Tavoitteen ulkopuolella</h2>
            <div className="flex flex-col gap-3">
              {otherCourses.map((course) => (
                <CourseRow
                  key={course.code}
                  code={course.code}
                  engagedIds={engagedIds}
                  knowledge={scores.courses[course.code]}
                  isExpanded={expandedCourse === course.code}
                  onToggle={() => toggleCourse(course.code)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {targetOpen && (
        <TargetGradeView
          targetGrade={targetGrade}
          onTargetGradeChange={handleTargetChange}
          onClose={() => setTargetOpen(false)}
        />
      )}
    </div>
  )
}
