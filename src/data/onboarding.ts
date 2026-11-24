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

// After a section's intro, a short guided tour: each step points at a real
// control (`data-onboarding` on the element) and waits for the student to
// use it – a tap/click, or a swipe/scroll of the feed.
export interface TourStep {
  target: string
  action: 'click' | 'swipe'
  text: string
}

export function getTourSteps(section: OnboardingSection, isDesktop: boolean): TourStep[] {
  const tap = isDesktop ? 'Napsauta' : 'Napauta'
  const swipe: TourStep = {
    target: 'feed',
    action: 'swipe',
    text: isDesktop ? 'Vieritä alas seuraavaan korttiin.' : 'Pyyhkäise ylös seuraavaan korttiin.',
  }
  switch (section) {
    case 'suositellut':
      return [
        {
          target: 'esitiedot',
          action: 'click',
          text: `${tap} tästä ja täytä lukion kurssiarvosanasi. Niistä lasketaan ensimmäinen arvosanaennusteesi.`,
        },
        { ...swipe, text: isDesktop ? 'Vieritä alas ensimmäiseen tehtävään.' : 'Pyyhkäise ylös ensimmäiseen tehtävään.' },
      ]
    case 'kurssit':
      return isDesktop
        ? [{ target: 'course-tasks', action: 'click', text: `${tap} Tehtävät nähdäksesi kurssin tehtävät.` }]
        : [
            { target: 'course-first', action: 'click', text: `${tap} kurssia avataksesi sen.` },
            { ...swipe, text: 'Pyyhkäise ylös käsitteestä sen harjoituksiin.' },
          ]
    case 'osaaminen':
      return [
        { target: 'target-grade', action: 'click', text: `${tap} tästä ja valitse tavoitearvosanasi.` },
        {
          target: 'osaaminen-esitiedot',
          action: 'click',
          text: `${tap} tästä tarkistaaksesi kurssiarvosanasi. Ne ovat ennusteen lähtökohta.`,
        },
      ]
  }
}
