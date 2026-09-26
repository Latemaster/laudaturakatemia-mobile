import { useMemo, useState } from 'react'
import Feed from './components/Feed'
import TopMenu, { type MenuSection } from './components/TopMenu'
import CourseList from './components/CourseList'
import Osaaminen from './components/Osaaminen'
import { cards } from './data/cards'
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
      return cards.filter((card) => card.topic.code === selectedCourse)
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
