import { useMemo, useState } from 'react'
import Feed from './components/Feed'
import TopMenu, { type MenuSection } from './components/TopMenu'
import CourseList from './components/CourseList'
import Osaaminen, { type AnswerRecord } from './components/Osaaminen'
import { cards } from './data/cards'
import type { TopicCode } from './types'

function App() {
  const [section, setSection] = useState<MenuSection>('suositellut')
  const [selectedCourse, setSelectedCourse] = useState<TopicCode | null>(null)
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({})

  function handleSelectSection(next: MenuSection) {
    if (next === 'kurssit' && section === 'kurssit') {
      setSelectedCourse(null)
      return
    }
    setSection(next)
    if (next !== 'kurssit') setSelectedCourse(null)
  }

  function handleAnswer(cardId: string, correct: boolean) {
    const card = cards.find((c) => c.id === cardId)
    if (!card) return
    setAnswers((prev) => ({ ...prev, [cardId]: { topic: card.topic.code, correct } }))
  }

  const feedCards = useMemo(() => {
    if (section === 'kurssit' && selectedCourse) {
      return cards.filter((card) => card.topic.code === selectedCourse)
    }
    return cards
  }, [section, selectedCourse])

  const showFeed = section === 'suositellut' || (section === 'kurssit' && selectedCourse !== null)

  return (
    <>
      <TopMenu active={section} onSelect={handleSelectSection} />
      {section === 'kurssit' && !selectedCourse && <CourseList onSelect={setSelectedCourse} />}
      {section === 'osaaminen' && <Osaaminen answers={answers} />}
      {showFeed && (
        <Feed
          key={selectedCourse ?? 'all'}
          cards={feedCards}
          onAnswer={handleAnswer}
          onBack={selectedCourse ? () => setSelectedCourse(null) : undefined}
        />
      )}
    </>
  )
}

export default App
