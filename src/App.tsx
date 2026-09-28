import { useMemo, useState } from 'react'
import Feed from './components/Feed'
import TopMenu, { type MenuSection } from './components/TopMenu'
import CourseList from './components/CourseList'
import Osaaminen from './components/Osaaminen'
import { cards, getConceptCards, getExerciseCards } from './data/cards'
import type { Card } from './types'
import type { TopicCode } from './types'

function App() {
  const [section, setSection] = useState<MenuSection>('suositellut')
  const [selectedCourse, setSelectedCourse] = useState<TopicCode | null>(null)
  const [engagedIds, setEngagedIds] = useState<Record<string, true>>({})

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
    return cards
  }, [section, selectedCourse])

  const showFeed = section === 'suositellut' || (section === 'kurssit' && selectedCourse !== null)

  return (
    <>
      <TopMenu active={section} onSelect={handleSelectSection} />
      {section === 'kurssit' && !selectedCourse && (
        <CourseList onSelect={setSelectedCourse} engagedIds={engagedIds} />
      )}
      {section === 'osaaminen' && <Osaaminen engagedIds={engagedIds} />}
      {showFeed && (
        <Feed
          key={selectedCourse ?? 'all'}
          cards={feedCards}
          onEngage={handleEngage}
          onBack={selectedCourse ? () => setSelectedCourse(null) : undefined}
        />
      )}
    </>
  )
}

export default App
