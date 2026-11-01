import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { motion } from 'framer-motion'
import { exerciseMaxPoints, markedCount, scoredPoints, type EvaluationAttempt } from '../../data/evaluation'
import { COURSE_MAP } from '../../data/courses'
import { RUBRIC_EXERCISES } from '../../data/rubrics'
import type { Card, ExerciseCard, TaskCard, Topic } from '../../types'
import AnswerEditor, { type AnswerEditorHandle } from '../AnswerEditor'
import PartedAnswerEditor from '../PartedAnswerEditor'
import { answerPartsFromPrompt, answerPartsFromRubric } from '../answerParts'
import ProblemBlocks from '../ProblemBlocks'
import KindLabel from '../KindLabel'
import { ExerciseBody } from '../ExerciseCardView'
import { ExpandIcon, ListCheckIcon, PencilIcon } from '../icons'
import TaskFullView, { type FullViewMode, type FullViewNav } from './TaskFullView'

// Laptop Kurssit › Tehtävät: every exercise in the same frame, a box of
// fixed size that fills the panel and never scrolls, so stepping through
// exercises never moves or resizes anything. Open-answer problems put the
// problem on the left and the answer on the right, one kohta at a time.
// The answer area goes beside or under the problem, whichever leaves it
// more room while the whole problem stays visible; a problem too long for
// either is answered in the full-screen view (TaskFullView), which is also
// where Pisteytys always opens.

// Each difficulty level has its own colour, borrowed from the course
// palette so it sits well with the rest of the app.
const LEVEL_BADGE: Record<string, string> = {
  Pikatehtävät: 'bg-topic-maa5/15 text-topic-maa5 ring-topic-maa5/30',
  Perus: 'bg-topic-maa2/15 text-topic-maa2 ring-topic-maa2/30',
  Keskivaikeat: 'bg-topic-maa4/15 text-topic-maa4 ring-topic-maa4/30',
  Vaikeat: 'bg-topic-maa7/15 text-topic-maa7 ring-topic-maa7/30',
  Soveltavat: 'bg-topic-maa6/15 text-topic-maa6 ring-topic-maa6/30',
}
const FALLBACK_BADGE = 'bg-accent/15 text-accent ring-accent/30'

interface Points {
  scored: number | null
  max: number
  // Every criterion has been marked.
  done: boolean
}

// The tally's colour, from `bad` through amber (topic-maa7) to `good` as
// the share of the maximum grows.
const TALLY_STOPS: [number, number, number][] = [
  [0xd9, 0x63, 0x6f],
  [0xd9, 0x8a, 0x3d],
  [0x2f, 0x9e, 0x6e],
]
function tallyColor(ratio: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, ratio)) * (TALLY_STOPS.length - 1)
  const i = Math.min(Math.floor(t), TALLY_STOPS.length - 2)
  const f = t - i
  return TALLY_STOPS[i].map((c, k) => Math.round(c + (TALLY_STOPS[i + 1][k] - c) * f)) as [number, number, number]
}
// The page's accent, before anything is scored.
const UNSCORED_COLOR: [number, number, number] = [0x56, 0x81, 0xbd]

// The points' colour as an rgba() string, shared by the badge and the
// answered exercise's outline.
function pointsColor(points: Points | undefined, alpha = 1): string {
  const [r, g, b] =
    !points || points.scored === null ? UNSCORED_COLOR : tallyColor(points.scored / points.max)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Counts from 0 up to `target` each time `trigger` changes (but not on
// mount): the fractional value while counting, null otherwise. Starts after
// a short pause so the full view has closed before the points pour in.
function useCountUp(target: number | null, trigger: number): number | null {
  const [value, setValue] = useState<number | null>(null)
  const targetRef = useRef(target)
  targetRef.current = target

  useEffect(() => {
    const to = targetRef.current
    if (trigger === 0 || !to) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const delay = 250
    const duration = Math.min(1400, 400 + to * 120)
    const start = performance.now() + delay
    let frame = 0
    setValue(0)
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration))
      setValue(t < 1 ? to * (1 - (1 - t) ** 3) : null)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [trigger])

  return value
}

// Up to this many points the scale shows one segment per point; above it,
// one continuous bar.
const MAX_SEGMENTS = 20
// The tile's side padding and the gap between segments, in rem (px-4, gap-1).
const TILE_PAD = 1
const SEGMENT_GAP = 0.25

// How far the tile's background fill reaches for `shown` of `max` points:
// exactly to the filled edge of the scale under it, which is inset by the
// tile's padding and broken by the segment gaps. Empty and full fill the
// whole tile's edges.
function fillWidth(shown: number, max: number): string {
  if (shown <= 0) return '0%'
  if (shown >= max) return '100%'
  const inner = `(100% - ${2 * TILE_PAD}rem)`
  if (max > MAX_SEGMENTS) return `calc(${TILE_PAD}rem + ${inner} * ${shown / max})`
  // The segments before the one the edge is in, and how much of that one is
  // filled; a whole number of points ends on its segment, not after the gap.
  const whole = Math.ceil(shown) - 1
  const part = shown - whole
  // A segment and the gap after it are (inner + gap) / max wide; a segment
  // alone is (inner - (max - 1) gaps) / max.
  return `calc(${TILE_PAD}rem + (${inner} + ${SEGMENT_GAP}rem) * ${whole / max} + (${inner} - ${
    (max - 1) * SEGMENT_GAP
  }rem) * ${part / max})`
}

// The header's top-right corner is the score, larger than the tags around
// it: "– / 12 p" before self-scoring, then the running tally on a scale with
// a segment per point, tinted from red to green by how much of the maximum
// it is. Once there is an answer it opens Pisteytys. Each change of
// `celebrate` (saving the points) fills the scale up from empty with a
// "+N p" rising over it.
function PointsBadge({ points, onOpen, celebrate = 0 }: { points: Points; onOpen?: () => void; celebrate?: number }) {
  const { scored, max, done } = points
  const counting = useCountUp(scored, celebrate)
  const shown = counting ?? scored
  const color = (alpha = 1) => pointsColor({ ...points, scored: shown }, alpha)
  const fill = (shown ?? 0) / max
  const label = done
    ? 'Pisteesi'
    : scored !== null
      ? 'Pisteytys kesken'
      : onOpen
        ? 'Pisteytä vastaus'
        : 'Pisteet'
  const content = (
    <>
      {/* The tile fills up with the points, behind the text. */}
      <span aria-hidden className="absolute inset-0 overflow-hidden rounded-2xl">
        <span
          className={`absolute inset-y-0 left-0 ${counting === null ? 'transition-[width] duration-500' : ''}`}
          style={{ width: fillWidth(shown ?? 0, max), backgroundColor: color(0.12) }}
        />
      </span>
      <span className="relative text-[11px] font-semibold uppercase tracking-wide">
        {label}
        {onOpen && ' ›'}
      </span>
      <span className="relative text-2xl font-bold leading-tight tabular-nums">
        {shown === null ? '–' : counting === null ? shown : Math.floor(shown)}
        <span className="text-base font-semibold"> / {max} p</span>
      </span>
      <span className="relative mt-1.5 flex h-2.5 w-full gap-1">
        {max <= MAX_SEGMENTS ? (
          Array.from({ length: max }, (_, i) => (
            <span key={i} className="h-full flex-1 overflow-hidden rounded-sm" style={{ backgroundColor: color(0.15) }}>
              <span
                className="block h-full"
                style={{
                  width: `${Math.min(1, Math.max(0, (shown ?? 0) - i)) * 100}%`,
                  backgroundColor: color(),
                }}
              />
            </span>
          ))
        ) : (
          <span className="h-full flex-1 overflow-hidden rounded-sm" style={{ backgroundColor: color(0.15) }}>
            <span className="block h-full" style={{ width: `${fill * 100}%`, backgroundColor: color() }} />
          </span>
        )}
      </span>
      {celebrate > 0 && scored !== null && scored > 0 && (
        <motion.span
          key={celebrate}
          aria-hidden
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: [0, 1, 1, 0], y: [6, -2, -10, -16] }}
          transition={{ delay: 0.25, duration: 1.6, times: [0, 0.15, 0.7, 1], ease: 'easeOut' }}
          className="pointer-events-none absolute right-3 top-1 text-sm font-bold"
          style={{ color: pointsColor(points) }}
        >
          +{scored} p
        </motion.span>
      )}
    </>
  )
  const className = 'relative flex w-56 flex-col items-start rounded-2xl px-4 py-2.5 text-left transition-colors'
  const style = { backgroundColor: color(0.06), color: color(), boxShadow: `inset 0 0 0 1px ${color(0.3)}` }
  // A small bump once the scale is full.
  const pulse = {
    initial: false as const,
    animate: celebrate > 0 ? { scale: [1, 1, 1.06, 1] } : undefined,
    transition: { duration: 1.9, times: [0, 0.75, 0.88, 1] },
  }
  return onOpen ? (
    <motion.button
      key={celebrate}
      {...pulse}
      type="button"
      onClick={onOpen}
      title="Näytä pisteytys"
      className={`${className} hover:brightness-95`}
      style={style}
    >
      {content}
    </motion.button>
  ) : (
    <motion.div
      key={celebrate}
      {...pulse}
      className={className}
      style={style}
      title="Lähetä vastaus, niin voit pisteyttää sen"
    >
      {content}
    </motion.div>
  )
}

function LevelTag({ level }: { level: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${LEVEL_BADGE[level] ?? FALLBACK_BADGE}`}>
      {level}
    </span>
  )
}

function CourseTag({ course }: { course: Topic }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${COURSE_MAP[course.code].badgeClass}`}>
      {course.code} · {course.name}
    </span>
  )
}

interface FrameProps {
  kind: ReactNode
  title: string
  // The difficulty level, shown as a coloured tag.
  badge: string
  points?: Points
  // Opens Pisteytys from the points; left out until there is an answer.
  onOpenPoints?: () => void
  // Bumped when the points are saved, to fill the points up again.
  celebrate?: number
  // Buttons after the title's tags; the top-right corner is the points'.
  actions?: ReactNode
  // Outlines the box in the points' colour, so an answered exercise stands
  // out at a glance.
  answered?: boolean
  // Shown as a course tag where exercises from several courses mix.
  course?: Topic
  children: ReactNode
}

function ExerciseFrame({
  kind,
  title,
  badge,
  points,
  onOpenPoints,
  celebrate,
  actions,
  answered,
  course,
  children,
}: FrameProps) {
  return (
    <section
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-ink/5 transition-shadow"
      style={answered ? { boxShadow: `0 0 0 2px ${pointsColor(points)}, 0 1px 2px rgba(0, 0, 0, 0.05)` } : undefined}
    >
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-ink/10 px-7 pb-4 pt-5">
        <div className="min-w-0">
          {kind}
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-bold leading-snug text-ink">{title}</h2>
            <LevelTag level={badge} />
            {course && <CourseTag course={course} />}
            {actions}
          </div>
        </div>
        {points && (
          <div className="shrink-0">
            <PointsBadge points={points} onOpen={onOpenPoints} celebrate={celebrate} />
          </div>
        )}
      </header>
      <div className="flex min-h-0 flex-1">{children}</div>
    </section>
  )
}

// The problem's side of the box. It shows the whole problem whenever the
// fitted layout can; when it can't, the bottom fades out and `clippedAction`
// (the full-screen view) sits over the fade.
function PromptColumn({ children, clippedAction }: { children: ReactNode; clippedAction?: ReactNode }) {
  return (
    <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden px-7 pb-7 pt-5">
      {children}
      {clippedAction && (
        <div className="absolute inset-x-0 bottom-0 flex h-28 items-end justify-center bg-gradient-to-t from-surface via-surface/90 to-transparent pb-6">
          {clippedAction}
        </div>
      )}
    </div>
  )
}

const MIN_ANSWER_WIDTH = 320
const MIN_ANSWER_HEIGHT = 260
// The problem column keeps at least this much beside the answer.
const MIN_PROMPT_WIDTH = 320

// Where the answer area goes: beside the problem ('row', size = its width)
// or under it ('column', size = its height).
interface AnswerLayout {
  direction: 'row' | 'column'
  size: number
}

// The layout that gives the answer area the most room while the whole
// problem stays visible, found by laying out a hidden copy of the problem
// (measureRef, padded like PromptColumn) at trial sizes:
// - side by side: the problem gets the narrowest width at which it fits
//   the box's height, the answer the rest;
// - stacked: the problem gets the full width and its natural height, the
//   answer the height left under it.
// 'none' when neither leaves the answer its minimum size. Re-measured when
// the box resizes and when images load.
function useAnswerLayout(bodyRef: RefObject<HTMLDivElement>, measureRef: RefObject<HTMLDivElement>) {
  const [layout, setLayout] = useState<AnswerLayout | 'none' | null>(null)

  const measure = useCallback(() => {
    const body = bodyRef.current
    const copy = measureRef.current
    if (!body || !copy) return
    const width = body.clientWidth
    const height = body.clientHeight
    const heightAt = (w: number) => {
      copy.style.width = `${w}px`
      return copy.offsetHeight
    }
    const fitsAt = (w: number) => heightAt(w) <= height + 1

    let row: AnswerLayout | null = null
    const widest = width - MIN_ANSWER_WIDTH
    if (widest >= MIN_PROMPT_WIDTH && fitsAt(widest)) {
      let lo = MIN_PROMPT_WIDTH
      let hi = widest
      if (fitsAt(lo)) hi = lo
      while (hi - lo > 4) {
        const mid = Math.floor((lo + hi) / 2)
        if (fitsAt(mid)) hi = mid
        else lo = mid
      }
      row = { direction: 'row', size: width - hi }
    }

    const left = height - heightAt(width)
    const column: AnswerLayout | null = left >= MIN_ANSWER_HEIGHT ? { direction: 'column', size: left } : null

    const area = (l: AnswerLayout | null) => (!l ? 0 : l.direction === 'row' ? l.size * height : l.size * width)
    const best = area(row) >= area(column) ? row : column
    setLayout((prev) =>
      best && prev && prev !== 'none' && prev.direction === best.direction && prev.size === best.size
        ? prev
        : (best ?? 'none'),
    )
  }, [bodyRef, measureRef])

  useLayoutEffect(() => {
    measure()
    const observer = new ResizeObserver(measure)
    if (bodyRef.current) observer.observe(bodyRef.current)
    return () => observer.disconnect()
  }, [measure, bodyRef])

  // Text reflows once the web font arrives.
  useEffect(() => {
    document.fonts?.ready.then(measure)
  }, [measure])

  return { layout, remeasure: measure }
}

// The answer area's edge towards the problem. The area already has all the
// room the problem can spare, so dragging only shrinks it (and back);
// double-click returns it to the fitted size.
function ResizeHandle({
  direction,
  size,
  maxSize,
  onSizeChange,
}: {
  direction: AnswerLayout['direction']
  size: number
  maxSize: number
  onSizeChange: (size: number | null) => void
}) {
  const row = direction === 'row'
  const minSize = row ? MIN_ANSWER_WIDTH : MIN_ANSWER_HEIGHT

  function startDrag(e: ReactPointerEvent<HTMLDivElement>) {
    e.preventDefault()
    const handle = e.currentTarget
    const start = row ? e.clientX : e.clientY
    handle.setPointerCapture(e.pointerId)
    const move = (ev: PointerEvent) => {
      const delta = start - (row ? ev.clientX : ev.clientY)
      onSizeChange(Math.min(maxSize, Math.max(minSize, size + delta)))
    }
    const end = () => {
      handle.removeEventListener('pointermove', move)
      handle.removeEventListener('pointerup', end)
      handle.removeEventListener('pointercancel', end)
    }
    handle.addEventListener('pointermove', move)
    handle.addEventListener('pointerup', end)
    handle.addEventListener('pointercancel', end)
  }

  return (
    <div
      role="separator"
      aria-orientation={row ? 'vertical' : 'horizontal'}
      aria-label="Muuta vastausalueen kokoa"
      title="Vedä pienentääksesi · tuplaklikkaus palauttaa"
      onPointerDown={startDrag}
      onDoubleClick={() => onSizeChange(null)}
      className={`group absolute z-10 flex touch-none items-center justify-center ${
        row ? 'inset-y-0 -left-1.5 w-3 cursor-col-resize' : 'inset-x-0 -top-1.5 h-3 cursor-row-resize'
      }`}
    >
      <span
        className={`rounded-full bg-ink/15 transition-colors group-hover:bg-accent group-active:bg-accent ${
          row ? 'h-12 w-1' : 'h-1 w-12'
        }`}
      />
    </div>
  )
}

interface TaskWorkspaceProps {
  card: TaskCard
  title: string
  badge: string
  attempt: EvaluationAttempt | undefined
  onAnswer: (answer: string) => void
  onScore: (criterionId: string, points: number | undefined) => void
  onReset: () => void
  // Held by CourseTasksView so the full view stays open from one exercise
  // to the next.
  fullView: FullViewMode | null
  onFullViewChange: (mode: FullViewMode | null) => void
  nav?: FullViewNav
  course?: Topic
}

function TaskWorkspace({
  card,
  title,
  badge,
  attempt,
  onAnswer,
  onScore,
  onReset,
  fullView,
  onFullViewChange: setFullView,
  nav,
  course,
}: TaskWorkspaceProps) {
  const exerciseId = `${card.topic.code.toLowerCase()}-${card.problem.id}`
  const rubricExercise = useMemo(() => RUBRIC_EXERCISES.find((e) => e.id === exerciseId), [exerciseId])
  // Kohdat from the rubric (with points) or, until one is written, from
  // the prompt's a), b), c) lines.
  const parts = useMemo(
    () => answerPartsFromRubric(rubricExercise?.parts) ?? answerPartsFromPrompt(card.problem.promptBlocks),
    [rubricExercise, card.problem.promptBlocks],
  )
  const points = useMemo((): Points | undefined => {
    if (!rubricExercise) return undefined
    const scores = attempt?.scores ?? {}
    const { marked, total } = markedCount(rubricExercise, scores)
    return {
      scored: marked === 0 ? null : scoredPoints(rubricExercise, scores),
      max: exerciseMaxPoints(rubricExercise),
      done: marked === total,
    }
  }, [rubricExercise, attempt?.scores])

  const bodyRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const { layout, remeasure } = useAnswerLayout(bodyRef, measureRef)
  // Set by dragging the handle; null follows the fitted size. Reset when
  // the layout flips direction, since the number no longer means the same.
  const [manualSize, setManualSize] = useState<number | null>(null)
  const direction = layout && layout !== 'none' ? layout.direction : null
  useEffect(() => setManualSize(null), [direction])
  // Shared by the inline and full-screen editors. The inline editor only
  // reads it on mount, so it remounts when the full view closes.
  const [draft, setDraft] = useState(attempt?.answer ?? '')
  const [editorKey, setEditorKey] = useState(0)
  const editorRef = useRef<AnswerEditorHandle>(null)
  const insertFormula = useCallback((latex: string) => editorRef.current?.insertFormula(latex), [])
  const answer = attempt?.answer ?? null
  const inline = layout !== null && layout !== 'none'
  const answerSize = inline ? Math.min(manualSize ?? layout.size, layout.size) : 0

  // Whether Pisteytys was opened from the full-screen answer view rather
  // than the exercise box: its close goes back to whichever it was.
  const [checkFromFullView, setCheckFromFullView] = useState(false)
  function showCheck() {
    setCheckFromFullView(fullView === 'answer')
    setFullView('check')
  }

  function send(value: string) {
    onAnswer(value)
    showCheck()
  }

  function closeFullView() {
    setFullView(null)
    setEditorKey((k) => k + 1)
  }

  function closeCheck() {
    if (checkFromFullView) setFullView('answer')
    else closeFullView()
  }

  // "Tallenna pisteet": back to the exercise box, where the points fill up.
  const [celebrate, setCelebrate] = useState(0)
  function saveScores() {
    closeFullView()
    setCelebrate((c) => c + 1)
  }

  // The hidden copy always has the hint, so whether it shows can't change
  // the measurement that decides whether it shows.
  const prompt = (withHint: boolean) => (
    <>
      <div className="text-base leading-relaxed text-ink">
        <ProblemBlocks blocks={card.problem.promptBlocks} onFormulaTap={inline ? insertFormula : undefined} />
      </div>
      {withHint && <p className="mt-4 text-xs text-ink-dim">Napauta tehtävän kaavaa, niin se lisätään vastaukseesi.</p>}
    </>
  )

  const editorProps = {
    ref: editorRef,
    initialValue: draft,
    onChange: setDraft,
    onSubmit: send,
    submitLabel: answer === null ? 'Lähetä vastaus' : 'Lähetä uudelleen',
  }

  const openCheck = answer !== null ? showCheck : undefined

  // Beside the title's tags while the answer fits inline; over the
  // problem's faded bottom, as the way to answer, when it doesn't.
  const fullScreenButton = (
    <button
      type="button"
      onClick={() => setFullView('answer')}
      className={`flex items-center gap-1.5 rounded-full font-semibold transition-colors ${
        inline
          ? 'px-3 py-1 text-xs text-ink-dim ring-1 ring-ink/10 hover:bg-surface-2 hover:text-ink'
          : 'bg-accent px-5 py-2.5 text-sm text-white shadow-md hover:opacity-90'
      }`}
    >
      <ExpandIcon className={inline ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      Vastaa koko näytöllä
    </button>
  )

  const actions = (
    <>
      {/* Without a rubric there are no points to open Pisteytys from. */}
      {!points && openCheck && (
        <button
          type="button"
          onClick={openCheck}
          className="rounded-full px-3 py-1 text-xs font-semibold text-accent ring-1 ring-accent/30 transition-colors hover:bg-accent/10"
        >
          Näytä pisteytys
        </button>
      )}
      {inline && fullScreenButton}
    </>
  )

  return (
    <ExerciseFrame
      kind={<KindLabel icon={<PencilIcon />} label="Tehtävä" />}
      title={title}
      badge={badge}
      points={points}
      onOpenPoints={openCheck}
      celebrate={celebrate}
      actions={actions}
      answered={answer !== null}
      course={course}
    >
      <div
        ref={bodyRef}
        className={`relative flex min-h-0 min-w-0 flex-1 ${direction === 'column' ? 'flex-col' : 'flex-row'}`}
      >
        {/* Hidden copy of the problem, laid out at trial sizes to fit the
            answer area; padded like PromptColumn. */}
        <div
          ref={measureRef}
          aria-hidden
          onLoadCapture={remeasure}
          className="pointer-events-none invisible absolute left-0 top-0 px-7 pb-7 pt-5"
        >
          {prompt(true)}
        </div>

        <PromptColumn clippedAction={layout === 'none' ? fullScreenButton : undefined}>{prompt(inline)}</PromptColumn>

        {inline && (
          <div
            className={`relative flex shrink-0 flex-col border-ink/10 bg-surface-2/50 ${
              layout.direction === 'row' ? 'border-l' : 'border-t'
            }`}
            style={layout.direction === 'row' ? { width: answerSize } : { height: answerSize }}
          >
            <ResizeHandle
              direction={layout.direction}
              size={answerSize}
              maxSize={layout.size}
              onSizeChange={setManualSize}
            />
            <div className="flex h-full min-h-0 flex-col overflow-y-auto p-5">
              {parts ? (
                <PartedAnswerEditor key={editorKey} parts={parts} layout="tabs" {...editorProps} />
              ) : (
                <AnswerEditor key={editorKey} fill {...editorProps} />
              )}
            </div>
          </div>
        )}
      </div>

      {fullView && (
        <TaskFullView
          card={card}
          title={title}
          levelTag={
            <>
              <LevelTag level={badge} />
              {course && <CourseTag course={course} />}
            </>
          }
          mode={fullView}
          onModeChange={(mode) => (mode === 'check' ? showCheck() : setFullView(mode))}
          onCloseCheck={closeCheck}
          rubricExercise={rubricExercise}
          parts={parts}
          answer={answer}
          draft={draft}
          onDraftChange={setDraft}
          onSend={send}
          scores={attempt?.scores ?? {}}
          onScore={onScore}
          onResetScores={onReset}
          onClose={closeFullView}
          onSaveScores={saveScores}
          nav={nav}
        />
      )}
    </ExerciseFrame>
  )
}

function QuickExerciseWorkspace({
  card,
  title,
  badge,
  course,
  onAnswer,
}: {
  card: ExerciseCard
  title: string
  badge: string
  course?: Topic
  onAnswer: (correct: boolean) => void
}) {
  return (
    <ExerciseFrame
      course={course}
      kind={
        <KindLabel
          icon={card.kind === 'numeric' ? <PencilIcon /> : <ListCheckIcon />}
          label={card.kind === 'numeric' ? 'Laske ja vastaa' : 'Monivalinta'}
        />
      }
      title={title}
      badge={badge}
    >
      <PromptColumn>
        <h3 className="mb-5 text-lg font-semibold leading-snug text-ink">{card.question}</h3>
        <div className="max-w-2xl">
          <ExerciseBody card={card} onAnswer={onAnswer} />
        </div>
      </PromptColumn>
    </ExerciseFrame>
  )
}

interface ExerciseWorkspaceProps {
  card: Card
  // "Tehtävä 3", "Pikatehtävä 2"...
  title: string
  badge: string
  attempt: EvaluationAttempt | undefined
  onEngage: () => void
  onQuickAnswer: (correct: boolean) => void
  onTaskAnswer: (answer: string) => void
  onScore: (criterionId: string, points: number | undefined) => void
  onResetScores: () => void
  fullView: FullViewMode | null
  onFullViewChange: (mode: FullViewMode | null) => void
  // Edellinen / Seuraava in the full view; left out where there's no
  // order to step through (the feed).
  nav?: FullViewNav
  // Shows the course as a tag, for the feed where courses mix.
  showCourse?: boolean
}

export default function ExerciseWorkspace(props: ExerciseWorkspaceProps) {
  const { card, title, badge } = props
  const course = props.showCourse ? card.topic : undefined
  if (card.type === 'exercise') {
    return (
      <QuickExerciseWorkspace
        card={card}
        title={title}
        badge={badge}
        course={course}
        onAnswer={(correct) => {
          props.onEngage()
          props.onQuickAnswer(correct)
        }}
      />
    )
  }
  if (card.type !== 'task') return null
  return (
    <TaskWorkspace
      card={card}
      title={title}
      badge={badge}
      attempt={props.attempt}
      onAnswer={(answer) => {
        props.onEngage()
        props.onTaskAnswer(answer)
      }}
      onScore={props.onScore}
      onReset={props.onResetScores}
      fullView={props.fullView}
      onFullViewChange={props.onFullViewChange}
      nav={props.nav}
      course={course}
    />
  )
}
