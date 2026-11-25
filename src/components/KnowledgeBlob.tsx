import { KNOWLEDGE_LEVELS, type CourseKnowledge, type KnowledgeLevel } from '../data/knowledge'
import { LEVEL_COLORS } from './knowledgeColors'

const BLOB = 'whitespace-nowrap rounded-full border-2 px-2.5 py-px text-[11px] font-semibold leading-4'

// The student's level in a course, on the top right corner of the course's
// box (see knowledgeBorder): filled when it rests on answers, outlined when
// it comes from the course grade alone.
export default function KnowledgeBlob({ course }: { course: CourseKnowledge }) {
  const { level, gradeOnly } = course
  const colors = level
    ? LEVEL_COLORS[level.level][gradeOnly ? 'outlined' : 'filled']
    : 'border-ink/10 bg-surface text-ink-dim'
  return (
    <span className={`pointer-events-none absolute -top-3 right-3 shadow-sm ${BLOB} ${colors}`}>
      <span className="sr-only">Osaamisesi: </span>
      {level ? level.label : 'Ei tietoa'}
    </span>
  )
}

function LegendBlob({ level, label }: { level: KnowledgeLevel; label: string }) {
  return <span className={`shrink-0 ${BLOB} ${LEVEL_COLORS[level].filled}`}>{label}</span>
}

// What the levels are and where they come from, for info panels.
export function KnowledgeLegend() {
  return (
    <>
      <p className="mb-2">
        Kurssin <span className="font-semibold text-ink">reunan väri</span> kertoo osaamisesi: arviomme siitä, miten
        hyvin hallitset kurssin. Se on saamasi pisteet jaettuna yrittämiesi tehtävien pisteillä.
      </p>
      <ul className="mb-2 flex flex-col gap-1.5">
        {KNOWLEDGE_LEVELS.map((level, index) => (
          <li key={level.level} className="flex items-center gap-2">
            <LegendBlob level={level.level} label={level.label} />
            <span>
              {index === 0
                ? `vähintään ${level.min} %`
                : level.min === 0
                  ? `alle ${KNOWLEDGE_LEVELS[index - 1].min} %`
                  : `${level.min}–${KNOWLEDGE_LEVELS[index - 1].min} %`}
            </span>
          </li>
        ))}
      </ul>
      <p className="mb-2">
        Vaalea reuna ja valkoinen merkki: arvio perustuu vain kurssiarvosanaasi. Se tarkentuu, kun vastaat kurssin
        tehtäviin.
      </p>
      <p>
        <span className="font-semibold text-ink">Palkki ja prosentti</span> kertovat, kuinka suuren osan kurssin
        pisteistä olet kerännyt.
      </p>
    </>
  )
}
