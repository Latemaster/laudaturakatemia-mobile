import { useState, type ReactNode } from 'react'
import { COURSE_MAP } from '../data/courses'
import { EXAM_MAX_POINTS, predictGrade, type FinnishGrade } from '../data/grade'
import {
  getFinnishGrade,
  getTargetPoints,
  saveTargetGrade,
  type TargetGrade,
} from '../data/studyPlans'
import type { CourseGrade, CourseGrades } from '../data/courseGrades'
import { getCoursePoints, getTargetProgress } from '../data/coursePoints'
import type { FoundGap } from '../data/foundGap'
import type { Knowledge } from '../data/knowledge'
import { getCheckpointProgress, pointsLabel, usePointsEarned, usePointsTotal } from '../data/points'
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
  knowledge: Knowledge
  foundGap: FoundGap | null
  // The gap's course is at the top of the Suositellut feed.
  gapLeadsFeed: boolean
}

const TIER_BADGE: Record<FinnishGrade['tier'], string> = {
  high: 'bg-good/15 text-good ring-good/30',
  mid: 'bg-accent/15 text-accent ring-accent/30',
  low: 'bg-bad/15 text-bad ring-bad/30',
}

// How sure the prediction is, in words; a third of the scale each. The
// colour deepens with intensity: the less sure, the deeper the red, and the
// further on, the deeper the amber and the green.
const CERTAINTY_LEVELS = [
  { label: 'Epävarma', from: '#a82a39', to: '#d9636f' },
  { label: 'Kohtalainen', from: '#cf8f35', to: '#9c5f0f' },
  { label: 'Varma', from: '#4aa87c', to: '#17694a' },
]

function certaintyLevel(certainty: number): { label: string; color: string } {
  const at = Math.min(1, Math.max(0, certainty)) * CERTAINTY_LEVELS.length
  const index = Math.min(CERTAINTY_LEVELS.length - 1, Math.floor(at))
  const { label, from, to } = CERTAINTY_LEVELS[index]
  return { label, color: `color-mix(in srgb, ${to} ${Math.round((at - index) * 100)}%, ${from})` }
}

// The knowledge levels' colours, merging from one to the next.
const SCALE_COLORS = 'linear-gradient(to right, #d9636f, #d98a3d, #e3c04f, #86cfa6, #2f9e6e)'

// How much of the prediction rests on the student's own answers rather
// than on course grades: a progress bar whose colours merge from red to
// green as it fills. Empty before there is a prediction.
function CertaintyBar({ certainty, known }: { certainty: number; known: boolean }) {
  const pct = Math.round(certainty * 100)
  // A prediction from course grades alone still shows the bar's beginning.
  const shown = known ? Math.max(4, pct) : 0
  return (
    <div>
      <div
        role="meter"
        aria-label="Ennusteen varmuus"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={known ? certaintyLevel(certainty).label : 'Ei ennustetta'}
        className="h-2.5 w-full overflow-hidden rounded-full bg-ink/10"
      >
        <span
          className="block h-full transition-[clip-path] duration-700"
          style={{ backgroundImage: SCALE_COLORS, clipPath: `inset(0 ${100 - shown}% 0 0 round 9999px)` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] font-medium text-ink-dim">
        <span>epävarma</span>
        <span>varma</span>
      </div>
    </div>
  )
}

// One ring's box under the rings, with a dot in the ring's colour: where
// the student is, and how far the next step is.
function RingBox({ color, title, value }: { color: string; title: string; value: string }) {
  return (
    <div className="flex w-full items-start gap-2.5 rounded-2xl bg-surface-2 p-3">
      <span aria-hidden className="mt-0.5 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">{title}</span>
        <span className="text-sm font-semibold leading-tight text-ink">{value}</span>
      </div>
    </div>
  )
}

// A card's title with its explanation button. On laptops the open
// explanation takes the card's place, scrolling inside it.
function CardTitle({
  title,
  infoLabel,
  info,
  open,
  onOpenChange,
  inline,
}: {
  title: string
  infoLabel: string
  info: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  inline: boolean
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">{title}</span>
      <InfoToggle label={infoLabel} open={open} onOpenChange={onOpenChange} inline={inline}>
        {info}
      </InfoToggle>
    </div>
  )
}

export default function Osaaminen({
  targetGrade,
  onTargetGradeChange,
  courseGrades,
  onCourseGradeChange,
  knowledge,
  foundGap,
  gapLeadsFeed,
}: OsaaminenProps) {
  const { isDesktop } = useLayout()
  const [targetOpen, setTargetOpen] = useState(false)

  const { overall } = knowledge
  const grade = predictGrade(overall.pct)
  const certainty = certaintyLevel(overall.certainty)
  const target = getFinnishGrade(targetGrade)
  const targetPoints = getTargetPoints(targetGrade)
  const ring = getTargetProgress(targetGrade, getCoursePoints(usePointsEarned()))
  const checkpoint = getCheckpointProgress(usePointsTotal())
  const rings = useRingsState()

  // On laptops an open explanation takes its card's place (scrolling
  // inside it), so the page still fits without scrolling.
  const [targetInfoOpen, setTargetInfoOpen] = useState(false)
  const [forecastInfoOpen, setForecastInfoOpen] = useState(false)

  const targetInfo = (
    <>
      <p className="mb-2">
        Rengas täyttyy pisteistä, joita keräät tavoitteesi lukusuunnitelman kursseilta. Esitiedot eivät täytä sitä.
      </p>
      <ul className="flex list-disc flex-col gap-1 pl-4">
        <li>Jokaisella suunnitelman kurssilla on oma osuutensa tarvittavista pisteistä, keskeisillä suurempi.</li>
        <li>
          Yhdeltä kurssilta lasketaan renkaaseen enintään puolitoista kertaa sen osuus. Vahva kurssi paikkaa siis
          heikkoa osittain, mutta yksi kurssi ei riitä.
        </li>
        <li>Jokainen piste kasvattaa silti kokonaispisteitäsi ja vie kohti seuraavaa tasoa.</li>
      </ul>
    </>
  )

  const forecastInfo = (
    <>
      <p className="mb-2">
        Ennuste on kurssien osaamisprosenttien keskiarvo, ja kaikki kurssit painavat yhtä paljon. Keskiarvoa verrataan
        yo-kokeen tyypillisiin pisterajoihin ({EXAM_MAX_POINTS} pisteen koe).
      </p>
      <ul className="mb-2 flex list-disc flex-col gap-1 pl-4">
        <li>
          <span className="font-semibold text-ink">Kurssin osaaminen</span> on saamasi pisteet jaettuna yrittämiesi
          tehtävien pisteillä. Vain ensimmäinen vastaus kuhunkin tehtävään lasketaan.
        </li>
        <li>
          <span className="font-semibold text-ink">Kurssiarvosana</span> antaa lähtötason: 4 on 10 %, 7 on 50 % ja 10
          on 90 %. Se painaa kahden pikatehtävän verran, joten omat vastauksesi ohittavat sen nopeasti. Arvosanat täytät
          esitiedoista.
        </li>
        <li>Kurssi, josta ei ole arvosanaa eikä vastauksia, lasketaan nollaksi.</li>
      </ul>
      <p className="mb-2">
        Varmuus kasvaa, kun ennuste perustuu yhä enemmän vastauksiisi eikä pelkkiin arvosanoihin.
      </p>
      <p>
        Osaaminen: Heikko alle 25 %, Kehittyvä 25–45 %, Kohtalainen 45–65 %, Vahva 65–85 % ja Erinomainen
        vähintään 85 %. Vaaleareunainen arvio tulee vain kurssiarvosanasta.
      </p>
    </>
  )

  function handleTargetChange(next: TargetGrade) {
    onTargetGradeChange(next)
    saveTargetGrade(next)
  }

  const card = `mb-6 rounded-3xl border border-ink/10 bg-surface p-6 shadow-sm ${isDesktop ? 'flex min-h-0 flex-col' : ''}`

  return (
    <PageContainer full>
      <h1 className="mb-1 text-2xl font-bold text-ink">Osaaminen</h1>
      <p className="mb-6 text-sm text-ink-dim">Tavoitteesi, ennusteesi ja edistymisesi.</p>

      {/* Laptops: the target on the left, the predicted grade with its
          esitiedot and Edistyminen ajan mittaan on the right, the chart
          taking what the prediction leaves, so the page fits without
          scrolling. Phones stack all three. */}
      <div className={isDesktop ? 'grid min-h-[36.5rem] flex-1 grid-cols-2 items-stretch gap-6 [&>*]:mb-0' : ''}>
        <div className={card}>
          <CardTitle
            title="Tavoite"
            infoLabel="Miten tavoiterengas täyttyy"
            info={targetInfo}
            open={targetInfoOpen}
            onOpenChange={setTargetInfoOpen}
            inline={!isDesktop}
          />
          {isDesktop && targetInfoOpen ? (
            <InfoPanel className="mt-3 min-h-0 flex-1 overflow-y-auto">{targetInfo}</InfoPanel>
          ) : (
            <>
              {/* The activity rings, as in the top bar: outer = points
                  towards the target grade, inner = the way to the next
                  level, the target in the middle. */}
              <div
                className={`mt-4 flex flex-col items-center ${
                  isDesktop ? 'flex-1 justify-center gap-6' : 'gap-5'
                }`}
              >
                <ActivityRings
                  size={isDesktop ? 280 : 168}
                  stroke={isDesktop ? 31 : 19}
                  outer={ring.progress}
                  state={rings}
                  popOnPoints={false}
                  center={
                    <span className="flex flex-col items-center leading-none">
                      <span className={`font-bold text-ink ${isDesktop ? 'text-6xl' : 'text-4xl'}`}>{target.letter}</span>
                      <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-ink-dim/70">
                        tavoite
                      </span>
                    </span>
                  }
                />
                <div className={`w-full gap-3 ${isDesktop ? 'grid grid-cols-2' : 'flex flex-col'}`}>
                  <RingBox
                    color={RING_COLORS.outer.stroke}
                    title={`Tavoite ${target.letter}`}
                    value={
                      ring.progress >= 1 ? 'Tavoite saavutettu!' : `${Math.floor(ring.progress * 100)} % edistyminen`
                    }
                  />
                  <RingBox
                    color={RING_COLORS.inner.stroke}
                    title={`Taso ${checkpoint.level}`}
                    value={
                      checkpoint.next
                        ? `${pointsLabel(checkpoint.toNext)} tasoon ${checkpoint.level + 1}`
                        : 'Ylin taso saavutettu!'
                    }
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTargetOpen(true)}
                aria-haspopup="dialog"
                aria-label="Muuta tavoitearvosanaa"
                data-onboarding="target-grade"
                className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-surface-2 p-3 text-left ring-1 ring-transparent transition-colors hover:bg-accent/10 hover:ring-accent/30 active:ring-accent/40"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ring-2 ${TIER_BADGE[target.tier]}`}
                >
                  {target.letter}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">
                    Tavoitearvosana
                  </span>
                  <span className="text-sm font-semibold text-ink">
                    Kokeessa aiemmin tarvittu: {targetPoints.avg} / {EXAM_MAX_POINTS} p.
                  </span>
                </div>
              </button>
            </>
          )}
        </div>

        <div className={isDesktop ? 'flex min-h-0 flex-col gap-6 [&>*]:mb-0' : ''}>
          <section className={`${card} ${isDesktop && forecastInfoOpen ? 'flex-1' : ''}`}>
            <CardTitle
              title="Ennustettu arvosana"
              infoLabel="Miten ennuste lasketaan"
              info={forecastInfo}
              open={forecastInfoOpen}
              onOpenChange={setForecastInfoOpen}
              inline={!isDesktop}
            />
            {isDesktop && forecastInfoOpen ? (
              <InfoPanel className="mt-3 min-h-0 flex-1 overflow-y-auto">{forecastInfo}</InfoPanel>
            ) : (
              <>
                <CourseGradesSection
                  courseGrades={courseGrades}
                  onCourseGradeChange={onCourseGradeChange}
                  grade={overall.known ? grade : null}
                  label={overall.known ? `${certainty.label} arvio` : 'Ei vielä arviota'}
                  labelColor={overall.known ? certainty.color : undefined}
                />
                {foundGap && (
                  <p className="mt-3 rounded-2xl bg-surface-2 p-3 text-sm leading-snug text-ink-dim">
                    <span className="font-semibold text-ink">
                      Löytyi aukko: {foundGap.code} {COURSE_MAP[foundGap.code].name}.
                    </span>{' '}
                    {gapLeadsFeed ? 'Nostimme sen syötteesi kärkeen.' : 'Sitä kannattaa harjoitella seuraavaksi.'}
                  </p>
                )}
                <div className="mt-4">
                  <CertaintyBar certainty={overall.certainty} known={overall.known} />
                </div>
              </>
            )}
          </section>

          {/* The prediction's explanation is longer than its card, so it
              takes the chart's room too while open. */}
          {!(isDesktop && forecastInfoOpen) && (
            <div className={isDesktop ? 'min-h-0 flex-1' : ''}>
              <ProgressChart targetGrade={targetGrade} fill={isDesktop} />
            </div>
          )}
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
