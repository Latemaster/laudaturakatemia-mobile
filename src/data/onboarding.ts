// First-visit introductions to the app's three main sections. Each section
// shows its own short onboarding step the first time it is opened, on
// phones and laptops alike; once dismissed it stays dismissed.
export type OnboardingSection = 'suositellut' | 'kurssit' | 'osaaminen'

export const ONBOARDING_SECTIONS: OnboardingSection[] = ['suositellut', 'kurssit', 'osaaminen']

export type OnboardingSeen = Partial<Record<OnboardingSection, true>>

const STORAGE_KEY = 'laudatur.onboardingSeen'

export function isOnboardingSection(section: string): section is OnboardingSection {
  return (ONBOARDING_SECTIONS as string[]).includes(section)
}

export function loadOnboardingSeen(): OnboardingSeen {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    const seen: OnboardingSeen = {}
    for (const section of ONBOARDING_SECTIONS) {
      if ((parsed as Record<string, unknown>)[section] === true) seen[section] = true
    }
    return seen
  } catch {
    return {}
  }
}

export function saveOnboardingSeen(seen: OnboardingSeen): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seen))
  } catch {
    // Storage can be unavailable; the intros then show once per session.
  }
}
