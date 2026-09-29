import { useState } from 'react'
import { COURSE_MAP } from '../data/courses'
import { STUDY_PLANS, getCourseTargets, type TargetGrade } from '../data/studyPlans'
import type { Difficulty } from '../data/progress'
import { InfoIcon, XIcon } from './icons'

interface FeedInfoProps {
  targetGrade: TargetGrade
  cardCount: number
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'helpot',
  mid: 'keskivaikeat',
  hard: 'vaikeat',
}

function describe(difficulties: Difficulty[]): string {
  if (difficulties.length === 3) return 'kaikki tehtävät'
  return difficulties.map((d) => DIFFICULTY_LABEL[d]).join(' ja ')
}

// Floating "i" button on the Suositellut feed. Opens a card explaining how
// the recommended cards are picked and ordered for the current target.
export default function FeedInfo({ targetGrade, cardCount }: FeedInfoProps) {
  const [open, setOpen] = useState(false)
  const plan = STUDY_PLANS[targetGrade]
  const courseTargets = getCourseTargets(targetGrade)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Miten suositellut valitaan"
        aria-haspopup="dialog"
        className="fixed right-4 top-[calc(env(safe-area-inset-top)+3.5rem)] z-20 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-ink shadow-md ring-1 ring-ink/5 backdrop-blur"
      >
        <InfoIcon className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="feed-info-title"
          className="fixed inset-0 z-40 flex items-end justify-center bg-ink/30 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-[calc(env(safe-area-inset-top)+4.5rem)] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4">
              <h2 id="feed-info-title" className="text-base font-bold text-ink">
                Miten suositellut valitaan
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Sulje"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink ring-1 ring-ink/10"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-4 text-sm leading-relaxed text-ink-dim">
              <p className="mb-3">
                Syöte perustuu tavoitearvosanaasi <span className="font-semibold text-ink">{targetGrade}</span> ja
                sen lukusuunnitelmaan. Suunnitelma kertoo, mitkä kurssit ja minkä vaikeustason tehtävät kannattaa
                kerrata, kun tähtää tähän arvosanaan.
              </p>

              <h3 className="mb-1 text-xs font-semibold uppercase tracking-widest text-ink-dim/70">Järjestys</h3>
              <ol className="mb-3 list-decimal space-y-1 pl-5">
                {plan.tiers.map((tier) => (
                  <li key={tier.title}>{tier.title}</li>
                ))}
              </ol>
              <p className="mb-3">
                Kortit tulevat tässä järjestyksessä. Jokaisesta kurssista näytetään ensin oppitunti ja sitten
                suunnitelman pyytämät tehtävät. Jos kurssi toistuu myöhemmässä vaiheessa vaikeammilla tehtävillä,
                ne tulevat vasta silloin – perusteet ensin, vaikeimmat viimeisenä.
              </p>

              <h3 className="mb-1 text-xs font-semibold uppercase tracking-widest text-ink-dim/70">
                Mukana olevat kurssit
              </h3>
              <ul className="mb-3 flex flex-col gap-1.5">
                {courseTargets.map(({ code, difficulties }) => (
                  <li key={code} className="flex items-center gap-2">
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${COURSE_MAP[code].badgeClass}`}
                    >
                      {code}
                    </span>
                    <span className="text-xs">{describe(difficulties)}</span>
                  </li>
                ))}
              </ul>

              <p className="mb-3">
                Vaikeustasot: helpot = Osa I, keskivaikeat = Osa II, vaikeat = Osat III–IV. Kurssit, joita
                suunnitelma ei mainitse, eivät ole syötteessä – löydät ne Kurssit-välilehdeltä.
              </p>

              <p className="rounded-xl bg-surface-2 p-3 text-xs">
                Yhteensä <span className="font-semibold text-ink">{cardCount} korttia</span>. Tavoitteen voit
                vaihtaa Osaaminen-sivulta.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
