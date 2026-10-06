import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'katex/dist/katex.min.css'
import './index.css'
import App from './App.tsx'
import { getThemeIssues } from './data/knowledge'

// Theme tagging is hand-written data; surface gaps while developing so an
// exercise or task never silently stops counting towards a score.
if (import.meta.env.DEV) {
  for (const issue of getThemeIssues()) console.warn(`[themes] ${issue}`)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
