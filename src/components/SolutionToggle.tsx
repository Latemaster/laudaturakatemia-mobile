interface SolutionToggleProps {
  showSolution: boolean
  onToggle: () => void
}

// Small pill for the full-screen task views; only offered once the student
// has sent an answer.
export default function SolutionToggle({ showSolution, onToggle }: SolutionToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={showSolution}
      className={`flex h-9 shrink-0 items-center rounded-full px-3.5 text-xs font-semibold shadow-md ring-1 transition-colors ${
        showSolution ? 'bg-accent text-white ring-accent' : 'bg-surface text-accent ring-ink/10 active:bg-ink/5'
      }`}
    >
      {showSolution ? 'Takaisin tehtävään' : 'Näytä ratkaisu'}
    </button>
  )
}
