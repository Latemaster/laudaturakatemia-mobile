import { useState } from 'react'
import { motion } from 'framer-motion'
import type { LessonCard } from '../types'
import CardShell from './CardShell'
import ExpandableBox from './ExpandableBox'
import KindLabel from './KindLabel'
import MathText from './MathText'
import { VISUALS } from './visuals'
import { BookIcon } from './icons'
import { useLayout } from '../layout/LayoutContext'

interface LessonCardViewProps {
  card: LessonCard
  showSwipeHint: boolean
}

export default function LessonCardView({ card, showSwipeHint }: LessonCardViewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { isDesktop } = useLayout()
  const Visual = card.visual ? VISUALS[card.visual] : null

  const swipeHint = !isExpanded && showSwipeHint && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{ delay: 0.8, duration: 1.6, repeat: Infinity }}
      className={`flex flex-col gap-1 text-sm text-ink-dim ${isDesktop ? 'mt-4 items-start' : 'mt-3 items-center'}`}
    >
      <span>{isDesktop ? 'Vieritä alas jatkaaksesi' : 'Pyyhkäise ylös jatkaaksesi'}</span>
      <span aria-hidden>{isDesktop ? '↓' : '↑'}</span>
    </motion.div>
  )

  return (
    <CardShell
      topic={card.topic}
      below={!isDesktop && swipeHint}
      header={
        <>
          <KindLabel icon={<BookIcon />} label="Oppitunti" />
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.4 }}
            className={`font-bold leading-tight text-ink ${isDesktop ? 'mb-4 text-3xl' : 'text-2xl'}`}
          >
            {card.title}
          </motion.h1>
          {isDesktop && swipeHint}
        </>
      }
    >
      <ExpandableBox
        className={
          isDesktop ? 'card-box-max rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm' : 'px-5 pb-5 pt-4'
        }
        sizing={isDesktop ? 'natural' : 'fill'}
        isExpanded={isExpanded}
        onExpandedChange={setIsExpanded}
        overflowAction={isDesktop ? undefined : { label: 'Lue koko näytöllä' }}
      >
        {isExpanded && <h1 className="mb-4 mr-12 text-2xl font-bold leading-tight text-ink">{card.title}</h1>}
        {Visual && (
          <div className="mb-4">
            <Visual />
          </div>
        )}
        <div className="text-base leading-relaxed text-ink">
          <MathText content={card.body} />
        </div>
      </ExpandableBox>
    </CardShell>
  )
}
