export type Difficulty = 'easy' | 'mid' | 'hard'

// Every course's 35 problems are split 10/10/10/5 across "Osa I".."Osa IV"
// (some courses spell it "Osio"), matching the source packets' own
// perustehtävä / keskivaikea / syventävä / vaativa split. Osa III and IV are
// combined into one "hard" tier for a simple three-level breakdown.
export function classifyDifficulty(section: string): Difficulty {
  const roman = section.trim().split(/\s+/).pop()
  if (roman === 'I') return 'easy'
  if (roman === 'II') return 'mid'
  return 'hard'
}
