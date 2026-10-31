import { useEffect, useState } from 'react'
import { COURSE_MAP } from '../../data/courses'
import { POLL_OPTIONS, type PollLevel } from '../../data/knowledge'
import { goalKey, loadGoalConfidence, saveGoalConfidence, type GoalConfidence } from '../../data/goalConfidence'
import type { TopicCode } from '../../types'
import MathText from '../MathText'

// Kurssit › Oppimistavoitteet: the course's learning goals from the laptop
// site (data/goals/*.md), loaded on demand, as one list grouped by the
// file's "## Heading"s. Each goal takes a self-assessment on the Osaaminen
// pre-poll's four-step scale.
const GOAL_FILES = import.meta.glob<string>('../../data/goals/*.md', { query: '?raw', import: 'default' })

const HEADING = /^#{1,2}\s+(.+?)\s*$/
const BULLET = /^\s*[-*]\s+/

interface GoalGroup {
  heading: string
  goals: string[]
}

function parseGoals(markdown: string): { title: string; groups: GoalGroup[] } {
  let title = ''
  const groups: GoalGroup[] = []
  for (const line of markdown.replace(/\r\n?/g, '\n').split('\n')) {
    const heading = HEADING.exec(line)
    if (heading && /^#\s/.test(line) && !title && groups.length === 0) title = heading[1]
    else if (heading) groups.push({ heading: heading[1], goals: [] })
    else if (BULLET.test(line)) groups.at(-1)?.goals.push(line.replace(BULLET, '').trim())
  }
  return { title, groups: groups.filter((g) => g.goals.length > 0) }
}

function ConfidenceScale({ value, onChange, label }: { value: PollLevel | undefined; onChange: (level: PollLevel | undefined) => void; label: string }) {
  return (
    <div className="flex shrink-0 gap-1 rounded-full bg-surface-2 p-1 ring-1 ring-ink/5" role="radiogroup" aria-label={label}>
      {POLL_OPTIONS.map((option) => {
        const selected = option.level === value
        return (
          <button
            key={option.level}
            type="button"
            role="radio"
            aria-checked={selected}
            title={option.label}
            onClick={() => onChange(selected ? undefined : option.level)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              selected ? 'bg-accent text-white shadow-sm' : 'text-ink-dim hover:bg-surface hover:text-ink'
            }`}
          >
            {option.shortLabel}
          </button>
        )
      })}
    </div>
  )
}

export default function CourseGoalsView({ code }: { code: TopicCode }) {
  const [markdown, setMarkdown] = useState<{ code: TopicCode; text: string | null } | null>(null)
  const [confidence, setConfidence] = useState<GoalConfidence>(loadGoalConfidence)
  // The one heading whose goals are shown; undefined until the student
  // picks one, which shows the first, and null once they close it.
  const [openHeading, setOpenHeading] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    const load = GOAL_FILES[`../../data/goals/${code}_T.md`]
    if (!load) {
      setMarkdown({ code, text: null })
      return
    }
    load().then((text) => !cancelled && setMarkdown({ code, text }))
    return () => {
      cancelled = true
    }
  }, [code])

  function setLevel(key: string, level: PollLevel | undefined) {
    setConfidence((prev) => {
      const next = { ...prev }
      if (level === undefined) delete next[key]
      else next[key] = level
      saveGoalConfidence(next)
      return next
    })
  }

  if (!markdown || markdown.code !== code) return null
  const parsed = markdown.text ? parseGoals(markdown.text) : null

  if (!parsed || parsed.groups.length === 0) {
    return <p className="text-sm text-ink-dim">Tämän kurssin oppimistavoitteita ei ole vielä lisätty.</p>
  }

  const open = openHeading === undefined ? parsed.groups[0].heading : openHeading
  function toggle(heading: string) {
    setOpenHeading(open === heading ? null : heading)
  }

  const keysOf = (group: GoalGroup) => group.goals.map((goal) => goalKey(code, group.heading, goal))
  const total = parsed.groups.reduce((sum, g) => sum + g.goals.length, 0)
  const rated = parsed.groups.flatMap(keysOf).filter((key) => confidence[key] !== undefined).length
  let number = 0

  return (
    <div className="mx-auto w-full max-w-5xl pb-10">
      <header className="mb-5">
        <span className="inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-accent/30">
          Oppimistavoitteet
        </span>
        <h1 className="mt-3 text-2xl font-bold text-ink">{parsed.title || `${code}: ${COURSE_MAP[code].name}`}</h1>
        <p className="mt-1 text-sm text-ink-dim">
          Merkitse, kuinka hyvin osaat kunkin tavoitteen · {rated} / {total} arvioitu
        </p>
      </header>

      <div className="overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-ink/5">
        {parsed.groups.map((group) => {
          const keys = keysOf(group)
          const groupRated = keys.filter((key) => confidence[key] !== undefined).length
          const isOpen = open === group.heading
          const firstNumber = number + 1
          number += group.goals.length
          return (
            <section key={group.heading}>
              <h2>
                <button
                  type="button"
                  onClick={() => toggle(group.heading)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 border-b border-ink/5 bg-surface-2 px-5 py-3 text-left text-sm font-bold text-ink transition-colors hover:bg-accent/10"
                >
                  <span className={`text-xs text-ink-dim transition-transform ${isOpen ? 'rotate-90' : ''}`} aria-hidden>
                    ›
                  </span>
                  <span className="min-w-0 flex-1">{group.heading}</span>
                  <span className="text-xs font-semibold text-ink-dim">
                    {groupRated} / {keys.length}
                  </span>
                </button>
              </h2>
              {isOpen && (
                <ol>
                  {group.goals.map((goal, index) => {
                    const goalNumber = firstNumber + index
                    const key = keys[index]
                    return (
                      <li key={key} className="flex items-center gap-4 border-b border-ink/5 px-5 py-3 last:border-b-0">
                        <span className="w-5 shrink-0 text-right text-xs font-semibold text-ink-dim">{goalNumber}</span>
                        <div className="min-w-0 flex-1 text-sm leading-relaxed text-ink">
                          <MathText content={goal} />
                        </div>
                        <ConfidenceScale
                          value={confidence[key]}
                          onChange={(level) => setLevel(key, level)}
                          label={`Kuinka hyvin osaat tavoitteen ${goalNumber}`}
                        />
                      </li>
                    )
                  })}
                </ol>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
