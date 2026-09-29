import { useMemo, useState } from 'react'
import Feed from './components/Feed'
import TopMenu, { type MenuSection } from './components/TopMenu'
import CourseList from './components/CourseList'
import Osaaminen from './components/Osaaminen'
import SuositellutHome from './components/SuositellutHome'
import { cards, getConceptCards, getExerciseCards } from './data/cards'
import { getRecommendedCards, loadTargetGrade, saveTargetGrade, type TargetGrade } from './data/studyPlans'
import type { Card } from './types'
import type { TopicCode } from './types'

function App() {
  const [section, setSection] = useState<MenuSection>('suositellut')
  const [selectedCourse, setSelectedCourse] = useState<TopicCode | null>(null)
  const [engagedIds, setEngagedIds] = useState<Record<string, true>>({})
  const [targetGrade, setTargetGrade] = useState<TargetGrade>(loadTargetGrade)
  // The Suositellut home (target grade + plan outline) is shown every time
  // the section is opened; "Aloita kertaus" dismisses it until next time.
  const [showHome, setShowHome] = useState(true)

  function handleSelectSection(next: MenuSection) {
    if (next === 'kurssit' && section === 'kurssit') {
      setSelectedCourse(null)
      return
    }
    if (next === 'suositellut') setShowHome(true)
    setSection(next)
    if (next !== 'kurssit') setSelectedCourse(null)
  }

  function handleTargetGradeChange(grade: TargetGrade) {
    setTargetGrade(grade)
    saveTargetGrade(grade)
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
      // Each concept is immediately followed by its matching multiple-choice
      // exercise, when one exists; open-answer task cards stay untouched and
      // come after, at the end.
      const exercises = getExerciseCards(selectedCourse)
      const lessonAndExercises: Card[] = concepts.flatMap((concept, index) =>
        exercises[index] ? [concept, exercises[index]] : [concept],
      )
      return [...lessonAndExercises, ...courseCards.filter((card) => card.type !== 'lesson')]
    }
    return recommendedCards
  }, [section, selectedCourse, recommendedCards])

  const showSuositellutHome = section === 'suositellut' && showHome
  const showFeed =
    (section === 'suositellut' && !showHome) || (section === 'kurssit' && selectedCourse !== null)

  return (
    <>
      <TopMenu active={section} onSelect={handleSelectSection} />
      {showSuositellutHome && (
        <SuositellutHome
          targetGrade={targetGrade}
          onTargetGradeChange={handleTargetGradeChange}
          cardCount={recommendedCards.length}
          onStart={() => setShowHome(false)}
        />
      )}
      {section === 'kurssit' && !selectedCourse && (
        <CourseList onSelect={setSelectedCourse} engagedIds={engagedIds} />
      )}
      {section === 'osaaminen' && <Osaaminen engagedIds={engagedIds} targetGrade={targetGrade} />}
      {showFeed && (
        <Feed
          key={selectedCourse ?? `suositellut-${targetGrade}`}
          cards={feedCards}
          onEngage={handleEngage}
          onBack={selectedCourse ? () => setSelectedCourse(null) : () => setShowHome(true)}
          backLabel={selectedCourse ? 'Takaisin kursseihin' : 'Takaisin tavoitteeseen'}
        />
      )}
    </>
  )
}

export default App
