import { useMemo } from 'react'
import type { LessonCard } from '../../types'
import { getConceptCards } from '../../data/cards'
import KindLabel from '../KindLabel'
import MathText from '../MathText'
import { SplitColumns } from '../ExerciseCardView'
import { VISUALS } from '../visuals'
import { BookIcon } from '../icons'
import { ExerciseFrame } from './ExerciseWorkspace'

// Laptop feed lesson: the exercise box's frame, filling the panel like the
// exercises around it. The lesson text is on the left; the tinted right
// side has the lesson's visual, if any, and the course's theory topics,
// so the student sees what the short lesson opens onto.
export default function LessonWorkspace({ card }: { card: LessonCard }) {
  const Visual = card.visual ? VISUALS[card.visual] : null
  const topics = useMemo(() => getConceptCards(card.topic.code), [card.topic.code])

  return (
    <ExerciseFrame kind={<KindLabel icon={<BookIcon />} label="Oppitunti" />} title={card.title} course={card.topic}>
      <SplitColumns
        left={
          <div className="text-lg leading-relaxed text-ink">
            <MathText content={card.body} />
          </div>
        }
        right={
          <>
            {Visual && (
              <div className="mb-6">
                <Visual />
              </div>
            )}
            {topics.length > 0 && (
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-dim/70">
                  Kurssin teoria · {topics.length} aihetta
                </h3>
                <ol className="grid grid-cols-1 gap-1.5 xl:grid-cols-2">
                  {topics.map((topic, index) => (
                    <li
                      key={topic.id}
                      className="flex items-baseline gap-2.5 rounded-xl bg-surface px-3 py-2 text-sm text-ink ring-1 ring-ink/5"
                    >
                      <span className="w-5 shrink-0 text-xs font-semibold tabular-nums text-ink-dim/70">{index + 1}</span>
                      <span className="min-w-0">{topic.title}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </>
        }
      />
    </ExerciseFrame>
  )
}
