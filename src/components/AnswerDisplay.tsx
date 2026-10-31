import MathText from './MathText'
import { splitPartAnswers, type AnswerPart } from './answerParts'
import { toKatexAnswer } from './mathAnswerFormat'

interface AnswerDisplayProps {
  answer: string
  parts?: AnswerPart[] | null
}

// A sent answer: plain text, or kohta by kohta when the problem is split
// into kohdat, with each kohta's points beside it.
export default function AnswerDisplay({ answer, parts }: AnswerDisplayProps) {
  if (!parts) {
    return (
      <div className="text-sm leading-relaxed text-ink">
        <MathText content={toKatexAnswer(answer)} />
      </div>
    )
  }
  const answers = splitPartAnswers(answer, parts)
  return (
    <ol className="flex flex-col divide-y divide-ink/10">
      {parts.map((part, i) => (
        <li key={part.label} className="flex gap-3 py-2 first:pt-0 last:pb-0">
          <span className="w-6 shrink-0 pt-0.5 text-sm font-bold text-ink">{part.label}</span>
          <div className="min-w-0 flex-1 text-sm leading-relaxed text-ink">
            {answers[i].trim() ? (
              <MathText content={toKatexAnswer(answers[i])} />
            ) : (
              <span className="italic text-ink-dim">Ei vastausta</span>
            )}
          </div>
          {part.points !== undefined && (
            <span className="shrink-0 pt-0.5 text-xs font-semibold text-ink-dim">{part.points} p</span>
          )}
        </li>
      ))}
    </ol>
  )
}
