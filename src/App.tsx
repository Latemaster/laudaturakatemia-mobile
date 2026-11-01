import { useMemo, useState, type CSSProperties } from 'react'
import Feed from './components/Feed'
import TopMenu from './components/TopMenu'
import CourseList from './components/CourseList'
import Osaaminen from './components/Osaaminen'
import FeedInfo from './components/FeedInfo'
import FeedIntroCard from './components/FeedIntroCard'
import EvaluationList from './components/EvaluationList'
import { cards, getConceptCards, getExerciseCards, groupExercisesByConcept } from './data/cards'
import { getRecommendedCards, loadTargetGrade, type TargetGrade } from './data/studyPlans'
import { loadCourseGrades, saveCourseGrades, type CourseGrade, type CourseGrades } from './data/courseGrades'
import {
  loadKnowledge,
  recordAttempt,
  saveKnowledge,
  setPoll,
  type KnowledgeState,
  type PollLevel,
} from './data/knowledge'
import type { ThemeId } from './data/themes'
import type { Card, TopicCode } from './types'
import { LayoutContext, useIsDesktopViewport } from './layout/LayoutContext'
import DesktopTopBar from './layout/DesktopTopBar'
import DesktopSidebar from './layout/DesktopSidebar'
import { hasSidebar, isMenuSection, type AppSection, type CourseView, type EtusivuPage } from './layout/sections'
import { COURSES } from './data/courses'
import CourseGoalsView from './components/course/CourseGoalsView'
import CourseSummaryView from './components/course/CourseSummaryView'
import CourseTasksView from './components/course/CourseTasksView'
import EsittelyPage from './pages/EsittelyPage'
import TuePage from './pages/TuePage'
import MahdollistajatPage from './pages/MahdollistajatPage'

function App() {
  const isDesktop = useIsDesktopViewport()
  // Laptops open on the site's front page; phones go straight to the feed.
  const [requestedSection, setSection] = useState<AppSection>(() => (isDesktop ? 'etusivu' : 'suositellut'))
  // Etusivu and Mahdollistajat only exist in the laptop layout; if the
  // window shrinks to phone size on one of them, show the feed instead.
  const section: AppSection = isDesktop || isMenuSection(requestedSection) ? requestedSection : 'suositellut'
  const [etusivuPage, setEtusivuPage] = useState<EtusivuPage>('esittely')
  const [selectedCourse, setSelectedCourse] = useState<TopicCode | null>(null)
  // Laptop Kurssit: which of the course's pages is open. The laptop layout
  // always has a course open, the first one until the student picks one.
  const [courseView, setCourseView] = useState<CourseView>('tavoitteet')
  const desktopCourse = selectedCourse ?? COURSES[0].code
  const [engagedIds, setEngagedIds] = useState<Record<string, true>>({})
  // Set from the Osaaminen page; drives the Suositellut feed and what
  // Osaaminen tracks. Persisted by the component that changes it.
  const [targetGrade, setTargetGrade] = useState<TargetGrade>(loadTargetGrade)
  // Lukio course grades (4-10) the student reports on the Osaaminen page
  // as an early indication of their level. Kept here rather than in the
  // page so a later knowledge check elsewhere can reflect against them.
  const [courseGrades, setCourseGrades] = useState<CourseGrades>(loadCourseGrades)
  // Per-theme knowledge evidence (data/knowledge.ts): pre-poll answers and
  // first attempts at cards. Drives the theme scores on the Osaaminen page.
  const [knowledge, setKnowledge] = useState<KnowledgeState>(loadKnowledge)

  function handleAnswer(cardId: string, correct: boolean) {
    setKnowledge((prev) => {
      const next = recordAttempt(prev, cardId, correct ? 1 : 0)
      if (next !== prev) saveKnowledge(next)
      return next
    })
  }

  function handlePollChange(themeId: ThemeId, level: PollLevel | undefined) {
    setKnowledge((prev) => {
      const next = setPoll(prev, themeId, level)
      saveKnowledge(next)
      return next
    })
  }

  function handleCourseGradeChange(code: TopicCode, grade: CourseGrade | undefined) {
    setCourseGrades((prev) => {
      const next = { ...prev }
      if (grade === undefined) delete next[code]
      else next[code] = grade
      saveCourseGrades(next)
      return next
    })
  }

  function handleSelectSection(next: AppSection) {
    if (next === 'kurssit' && section === 'kurssit') {
      if (isDesktop) return
      setSelectedCourse(null)
      return
    }
    setSection(next)
    if (next !== 'kurssit' && !isDesktop) setSelectedCourse(null)
  }

  function handleEngage(cardId: string) {
    setEngagedIds((prev) => (prev[cardId] ? prev : { ...prev, [cardId]: true }))
  }

  const recommendedCards = useMemo(() => getRecommendedCards(targetGrade), [targetGrade])

  const feedCards = useMemo(() => {
    if (section === 'kurssit' && selectedCourse) {
      const courseCards = cards.filter((card) => card.topic.code === selectedCourse)
      const concepts = getConceptCards(selectedCourse)
      if (concepts.length === 0) return courseCards
      // Concept boxes replace the single generic lesson blurb for this course.
      // Each concept is immediately followed by its exercises, when it has
      // any; open-answer task cards stay untouched and come after, at the end.
      const exercisesByConcept = groupExercisesByConcept(getExerciseCards(selectedCourse))
      const lessonAndExercises: Card[] = concepts.flatMap((concept, index) => [
        concept,
        ...(exercisesByConcept.get(index) ?? []),
      ])
      return [...lessonAndExercises, ...courseCards.filter((card) => card.type !== 'lesson')]
    }
    return recommendedCards
  }, [section, selectedCourse, recommendedCards])

  const showFeed = section === 'suositellut' || (section === 'kurssit' && selectedCourse !== null && !isDesktop)

  const content = (
    <>
      {section === 'etusivu' && (etusivuPage === 'esittely' ? <EsittelyPage /> : <TuePage />)}
      {section === 'mahdollistajat' && <MahdollistajatPage />}
      {section === 'kurssit' && isDesktop && (
        <div key={`${desktopCourse}-${courseView}`} className="h-full overflow-y-auto">
          {courseView === 'tavoitteet' ? (
            <div className="px-8 pt-7">
              <CourseGoalsView code={desktopCourse} />
            </div>
          ) : courseView === 'tiivistelma' ? (
            <CourseSummaryView code={desktopCourse} />
          ) : (
            <CourseTasksView code={desktopCourse} onEngage={handleEngage} onAnswer={handleAnswer} />
          )}
        </div>
      )}
      {section === 'kurssit' && !isDesktop && !selectedCourse && (
        <CourseList onSelect={setSelectedCourse} engagedIds={engagedIds} />
      )}
      {section === 'osaaminen' && (
        <Osaaminen
          targetGrade={targetGrade}
          onTargetGradeChange={setTargetGrade}
          courseGrades={courseGrades}
          onCourseGradeChange={handleCourseGradeChange}
          knowledge={knowledge}
          onPollChange={handlePollChange}
        />
      )}
      {section === 'arviointi' && <EvaluationList />}
      {section === 'suositellut' && <FeedInfo targetGrade={targetGrade} cardCount={recommendedCards.length} />}
      {showFeed && (
        <Feed
          key={section === 'kurssit' && selectedCourse ? selectedCourse : `suositellut-${targetGrade}`}
          cards={feedCards}
          onEngage={handleEngage}
          onAnswer={handleAnswer}
          onBack={section === 'kurssit' && selectedCourse ? () => setSelectedCourse(null) : undefined}
          backLabel="Takaisin kursseihin"
          intro={
            section === 'suositellut' ? (
              <FeedIntroCard
                targetGrade={targetGrade}
                courseGrades={courseGrades}
                onCourseGradeChange={handleCourseGradeChange}
                polls={knowledge.polls}
                onPollChange={handlePollChange}
              />
            ) : undefined
          }
        />
      )}
    </>
  )

  if (!isDesktop) {
    return (
      <LayoutContext.Provider value={{ isDesktop: false }}>
        <TopMenu active={isMenuSection(section) ? section : 'suositellut'} onSelect={handleSelectSection} />
        {content}
      </LayoutContext.Provider>
    )
  }

  return (
    <LayoutContext.Provider value={{ isDesktop: true }}>
      <div className="flex h-dvh flex-col overflow-hidden bg-page">
        <DesktopTopBar active={section} onSelect={handleSelectSection} />
        <div className="flex min-h-0 flex-1">
          {hasSidebar(section) && (
            <DesktopSidebar
              section={section}
              etusivuPage={etusivuPage}
              onEtusivuPageChange={setEtusivuPage}
              selectedCourse={desktopCourse}
              courseView={courseView}
              onSelectCourseView={(code, view) => {
                setSelectedCourse(code)
                setCourseView(view)
              }}
              engagedIds={engagedIds}
            />
          )}
          {/* The feed's cards are sized to this panel (index.css). */}
          {/* Framed content panel on the grid paper, as on the laptop site. */}
          <div className="grid-bg flex min-w-0 flex-1 p-4">
            <main
              className="relative min-w-0 flex-1 overflow-hidden rounded-3xl bg-surface/55 ring-1 ring-ink/5"
              style={{ '--feed-height': 'calc(100dvh - 6rem)', '--card-max-h': 'min(40rem, calc(100dvh - 11rem))' } as CSSProperties}
            >
              {content}
            </main>
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  )
}

export default App
