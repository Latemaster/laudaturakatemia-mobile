import { createContext, useContext, useEffect, useState } from 'react'

// One app, two layouts: the phone layout (floating pill menu, full-screen
// swipe feed) and the laptop layout (top bar, sidebar, content panel).
// Components that place themselves on the screen read this to pick the
// right positioning; everything else is shared as-is.
export const DESKTOP_QUERY = '(min-width: 1024px)'

export function useIsDesktopViewport(): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(DESKTOP_QUERY).matches,
  )
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY)
    const onChange = () => setMatches(media.matches)
    media.addEventListener('change', onChange)
    onChange()
    return () => media.removeEventListener('change', onChange)
  }, [])
  return matches
}

export const LayoutContext = createContext<{ isDesktop: boolean }>({ isDesktop: false })

export function useLayout() {
  return useContext(LayoutContext)
}
