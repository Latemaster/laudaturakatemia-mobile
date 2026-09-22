import { motion } from 'framer-motion'
import type { LessonCard } from '../types'
import CardShell from './CardShell'

interface LessonCardViewProps {
  card: LessonCard
  showSwipeHint: boolean
}

export default function LessonCardView({ card, showSwipeHint }: LessonCardViewProps) {
  return (
    <CardShell topic={card.topic}>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 0.4 }}
        className="mb-4 text-3xl font-bold leading-tight"
      >
        {card.title}
      </motion.h1>
      <p className="whitespace-pre-line text-lg leading-relaxed text-white/80">
        {card.body}
      </p>

      {showSwipeHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{ delay: 0.8, duration: 1.6, repeat: Infinity }}
          className="mt-10 flex flex-col items-center gap-1 text-sm text-white/50"
        >
          <span>Pyyhkäise ylös jatkaaksesi</span>
          <span aria-hidden>↑</span>
        </motion.div>
      )}
    </CardShell>
  )
}
