import { motion } from 'framer-motion'
import type { LessonCard } from '../types'
import CardShell from './CardShell'
import KindLabel from './KindLabel'
import MathText from './MathText'
import { BookIcon } from './icons'

interface LessonCardViewProps {
  card: LessonCard
  showSwipeHint: boolean
}

export default function LessonCardView({ card, showSwipeHint }: LessonCardViewProps) {
  return (
    <CardShell topic={card.topic}>
      <KindLabel icon={<BookIcon />} label="Oppitunti" />
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 0.4 }}
        className="mb-4 text-3xl font-bold leading-tight text-ink"
      >
        {card.title}
      </motion.h1>
      <div className="text-lg leading-relaxed text-ink-dim">
        <MathText content={card.body} />
      </div>

      {showSwipeHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{ delay: 0.8, duration: 1.6, repeat: Infinity }}
          className="mt-10 flex flex-col items-center gap-1 text-sm text-ink-dim"
        >
          <span>Pyyhkäise ylös jatkaaksesi</span>
          <span aria-hidden>↑</span>
        </motion.div>
      )}
    </CardShell>
  )
}
