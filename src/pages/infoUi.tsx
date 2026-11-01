import type { ReactNode } from 'react'

// Building blocks shared by the Etusivu and Mahdollistajat pages, in the
// app's own card style (white cards on the grid-paper page).

// `wide` uses the whole content panel instead of a centred column.
export function InfoPage({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={`h-full overflow-y-auto ${wide ? 'px-8 pb-10 pt-8' : 'px-10 pb-16 pt-10'}`}>
      <div className={`mx-auto flex w-full flex-col ${wide ? 'gap-8' : 'max-w-5xl gap-12'}`}>{children}</div>
    </div>
  )
}

// `compact` keeps the hero short, so what follows it starts above the fold.
export function InfoHero({
  title,
  children,
  compact = false,
}: {
  title: string
  children?: ReactNode
  compact?: boolean
}) {
  return (
    <section
      className={`rounded-3xl border border-ink/10 bg-surface text-center shadow-sm ${compact ? 'px-8 py-6' : 'px-8 py-10'}`}
    >
      <h1 className={`font-bold text-accent ${compact ? 'mb-2 text-3xl' : 'mb-4 text-4xl'}`}>{title}</h1>
      {children && <div className="mx-auto max-w-3xl space-y-3 text-lg leading-relaxed text-ink">{children}</div>}
    </section>
  )
}

export function InfoSection({ title, children, center = false }: { title: string; children: ReactNode; center?: boolean }) {
  return (
    <section>
      <h2 className={`mb-5 text-2xl font-bold text-ink ${center ? 'text-center' : ''}`}>{title}</h2>
      {children}
    </section>
  )
}

export function InfoCard({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}>
      {title && <h3 className="mb-3 text-center text-lg font-semibold text-ink">{title}</h3>}
      <div className="space-y-4 leading-relaxed text-ink">{children}</div>
    </div>
  )
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm-16 12V8.99l8 6.99 8-6.99V18H4z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.867-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2.001 3.6 4.601v5.595z" />
    </svg>
  )
}

export function ContactLinks({ email, linkedin }: { email: string; linkedin: string }) {
  return (
    <div className="flex justify-center gap-4 text-sm font-semibold">
      <a href={`mailto:${email}`} className="flex items-center gap-1.5 text-accent hover:underline">
        <MailIcon />
        Sähköposti
      </a>
      <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-accent hover:underline">
        <LinkedInIcon />
        LinkedIn
      </a>
    </div>
  )
}
