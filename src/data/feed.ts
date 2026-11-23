import { cards } from './cards'
import { COURSE_MAP } from './courses'
import { classifyDifficulty, type Difficulty } from './progress'
import { getCourseTargets, type TargetGrade } from './studyPlans'
import type { Card, TaskCard, TopicCode } from '../types'

// ---------------------------------------------------------------------------
// Feed settings (Suositellut › Syötteen asetukset)
// ---------------------------------------------------------------------------

// How the student wants the difficulty of the feed tuned on top of the plan.
//   all       – what the study plan asks for, per course
//   skipEasy  – the plan's tiers minus Osa I (mid when that leaves nothing)
//   hardOnly  – only Osa III–IV, whatever the plan says
export type FeedDifficulty = 'all' | 'skipEasy' | 'hardOnly'

export const FEED_DIFFICULTIES: { value: FeedDifficulty; label: string; hint: string }[] = [
  { value: 'all', label: 'Suunnitelman mukaan', hint: 'Helpot, keskivaikeat ja vaikeat sen mukaan, mitä lukusuunnitelma pyytää.' },
  { value: 'skipEasy', label: 'Ohita helpot', hint: 'Ei Osa I -tehtäviä. Hyvä, kun perusasiat ovat jo hallussa.' },
  { value: 'hardOnly', label: 'Vain vaikeat', hint: 'Vain Osat III–IV, kaikilta listan kursseilta.' },
]

export interface FeedPrefs {
  difficulty: FeedDifficulty
  // The feed's courses in priority order. null follows the target grade's
  // study plan, so changing the target still changes the feed until the
  // student edits the list themselves.
  courses: TopicCode[] | null
}

export const DEFAULT_FEED_PREFS: FeedPrefs = { difficulty: 'all', courses: null }

const ALL: Difficulty[] = ['easy', 'mid', 'hard']

// The plan's course order and per-course difficulties for a target grade.
function planDifficulties(grade: TargetGrade): Map<TopicCode, Difficulty[]> {
  return new Map(getCourseTargets(grade).map((target) => [target.code, target.difficulties]))
}

export function getFeedCourses(grade: TargetGrade, prefs: FeedPrefs): TopicCode[] {
  return prefs.courses ?? [...planDifficulties(grade).keys()]
}

// Which tiers the feed pulls from one course: the plan's (or all three for
// a course the student added themselves), then the difficulty setting.
export function getFeedDifficulties(grade: TargetGrade, prefs: FeedPrefs, code: TopicCode): Difficulty[] {
  const fromPlan = planDifficulties(grade).get(code) ?? ALL
  if (prefs.difficulty === 'hardOnly') return ['hard']
  if (prefs.difficulty === 'skipEasy') {
    const harder = fromPlan.filter((d) => d !== 'easy')
    return harder.length > 0 ? harder : ['mid']
  }
  return fromPlan
}

// ---------------------------------------------------------------------------
// Surfacing
// ---------------------------------------------------------------------------

// How many courses are mixed at a time, and how many tasks a course gives
// per turn before it steps aside for the next one in line.
const ACTIVE_COURSES = 3
const TASKS_PER_TURN = 4

const DIFFICULTY_RANK: Record<Difficulty, number> = { easy: 0, mid: 1, hard: 2 }

interface CourseQueue {
  code: TopicCode
  tasks: TaskCard[]
  taken: number
}

// Rotates through the courses in list order: ACTIVE_COURSES at a time, one
// task from each in turn. A course that has given TASKS_PER_TURN tasks
// goes to the back of the line with what it has left, and the next course
// takes its place. Each course's tasks run from easy to hard, so when a
// course comes round again it picks up where it left off, a level harder.
// The course's lesson card comes right before its first task.
function rotate(queues: CourseQueue[], lessons: Map<TopicCode, Card>): Card[] {
  const result: Card[] = []
  const waiting = queues.filter((queue) => queue.tasks.length > 0)
  const active: CourseQueue[] = []

  while (waiting.length > 0 || active.length > 0) {
    while (active.length < ACTIVE_COURSES && waiting.length > 0) {
      const next = waiting.shift()!
      next.taken = 0
      active.push(next)
    }
    for (const queue of [...active]) {
      const lesson = lessons.get(queue.code)
      if (lesson) {
        result.push(lesson)
        lessons.delete(queue.code)
      }
      result.push(queue.tasks.shift()!)
      queue.taken += 1
      if (queue.tasks.length === 0 || queue.taken >= TASKS_PER_TURN) {
        active.splice(active.indexOf(queue), 1)
        if (queue.tasks.length > 0) waiting.push(queue)
      }
    }
  }
  return result
}

// The Suositellut feed. Tasks the student has already answered are left
// out of the rotation and come at the very end, so the feed leads with
// new material but nothing disappears for good.
export function getRecommendedCards(
  grade: TargetGrade,
  prefs: FeedPrefs,
  answered: Record<string, unknown> = {},
): Card[] {
  const fresh: CourseQueue[] = []
  const done: CourseQueue[] = []
  const lessons = new Map<TopicCode, Card>()

  for (const code of getFeedCourses(grade, prefs)) {
    if (!(code in COURSE_MAP)) continue
    const wanted = new Set(getFeedDifficulties(grade, prefs, code))
    const tasks = cards
      .filter((card): card is TaskCard => card.topic.code === code && card.type === 'task')
      .map((card) => ({ card, difficulty: classifyDifficulty(card.problem.section) }))
      .filter(({ difficulty }) => wanted.has(difficulty))
      .sort((a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty])
      .map(({ card }) => card)
    if (tasks.length === 0) continue

    const lesson = cards.find((card) => card.topic.code === code && card.type === 'lesson')
    if (lesson) lessons.set(code, lesson)
    fresh.push({ code, tasks: tasks.filter((card) => !answered[card.id]), taken: 0 })
    done.push({ code, tasks: tasks.filter((card) => answered[card.id]), taken: 0 })
  }

  return [...rotate(fresh, lessons), ...rotate(done, lessons)]
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'laudatur.feedPrefs'

function isFeedDifficulty(value: unknown): value is FeedDifficulty {
  return value === 'all' || value === 'skipEasy' || value === 'hardOnly'
}

export function loadFeedPrefs(): FeedPrefs {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_FEED_PREFS
    const parsed = JSON.parse(raw) as Partial<FeedPrefs>
    const courses = Array.isArray(parsed.courses)
      ? parsed.courses.filter((code): code is TopicCode => typeof code === 'string' && code in COURSE_MAP)
      : null
    return {
      difficulty: isFeedDifficulty(parsed.difficulty) ? parsed.difficulty : 'all',
      courses,
    }
  } catch {
    return DEFAULT_FEED_PREFS
  }
}

export function saveFeedPrefs(prefs: FeedPrefs): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // Storage unavailable: the settings still apply for this session.
  }
}
