import { useMemo, useState } from 'react'
import Feed from './components/Feed'
import TopMenu, { type MenuSection } from './components/TopMenu'
import CourseList from './components/CourseList'
import Osaaminen from './components/Osaaminen'
import FeedInfo from './components/FeedInfo'
import { cards, getConceptCards, getExerciseCards, groupExercisesByConcept } from './data/cards'
import { getRecommendedCards, loadTargetGrade, type TargetGrade } from './data/studyPlans'
import { loadCourseGrades, saveCourseGrades, type CourseGrade, type CourseGrades } from './data/courseGrades'
import type { Card } from './types'
import type { TopicCode } from './types'

function App() {
  const [section, setSection] = useState<MenuSection>('suositellut')
  const [selectedCourse, setSelectedCourse] = useState<TopicCode | null>(null)
  const [engagedIds, setEngagedIds] = useState<Record<string, true>>({})
  // Set from the Osaaminen page; drives the Suositellut feed and what
  // Osaaminen tracks. Persisted by the component that changes it.
  const [targetGrade, setTargetGrade] = useState<TargetGrade>(loadTargetGrade)
  // Lukio course grades (4-10) the student reports on the Osaaminen page
  // as an early indication of their level. Kept here rather than in the
  // page so a later knowledge check elsewhere can reflect against them.
  const [courseGrades, setCourseGrades] = useState<CourseGrades>(loadCourseGrades)

  function handleCourseGradeChange(code: TopicCode, grade: CourseGrade | undefined) {
    setCourseGrades((prev) => {
      const next = { ...prev }
      if (grade === undefined) delete next[code]
      else next[code] = grade
      saveCourseGrades(next)
      return next
    })
  }

  function handleSelectSection(next: MenuSection) {
    if (next === 'kurssit' && section === 'kurssit') {
      setSelectedCourse(null)
      return
    }
    setSection(next)
    if (next !== 'kurssit') setSelectedCourse(null)
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

  const showFeed = section === 'suositellut' || (section === 'kurssit' && selectedCourse !== null)

  return (
    <>
      <TopMenu active={section} onSelect={handleSelectSection} />
      {section === 'kurssit' && !selectedCourse && (
        <CourseList onSelect={setSelectedCourse} engagedIds={engagedIds} />
      )}
      {section === 'osaaminen' && (
        <Osaaminen
          engagedIds={engagedIds}
          targetGrade={targetGrade}
          onTargetGradeChange={setTargetGrade}
          courseGrades={courseGrades}
          onCourseGradeChange={handleCourseGradeChange}
        />
      )}
      {section === 'suositellut' && <FeedInfo targetGrade={targetGrade} cardCount={recommendedCards.length} />}
      {showFeed && (
        <Feed
          key={selectedCourse ?? `suositellut-${targetGrade}`}
          cards={feedCards}
          onEngage={handleEngage}
          onBack={selectedCourse ? () => setSelectedCourse(null) : undefined}
          backLabel="Takaisin kursseihin"
        />
      )}
    </>
  )
}

export default App
