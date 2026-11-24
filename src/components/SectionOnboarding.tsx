import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { BookIcon, ChartIcon, CheckIcon, ChevronRightIcon, SparkIcon, XIcon } from './icons'
import { useLayout } from '../layout/LayoutContext'
import { ONBOARDING_SECTIONS, type OnboardingSection, type OnboardingSeen } from '../data/onboarding'

interface SectionOnboardingProps {
  section: OnboardingSection
  seen: OnboardingSeen
  // Closes the step without the guided tour.
  onDone: () => void
  // Closes the step and starts the section's guided tour.
  onStart: () => void
  // Closes this step and opens the given section, whose own step follows.
  onGoTo: (section: OnboardingSection) => void
}

interface Step {
  label: string
  icon: ReactNode
  title: string
  lead: string
  points: string[]
}

const LABELS: Record<OnboardingSection, string> = {
  suositellut: 'Suositellut',
  kurssit: 'Kurssit',
  osaaminen: 'Osaaminen',
}

// The wording follows the layout: phones swipe and tap, laptops scroll and
// click, and the laptop Kurssit has a sidebar instead of a course list.
function getStep(section: OnboardingSection, isDesktop: boolean): Step {
  switch (section) {
    case 'suositellut':
      return {
        label: LABELS.suositellut,
        icon: <SparkIcon />,
        title: 'Suositellut',
        lead: 'Tehtäväsyöte, joka valitsee puolestasi, mitä sinun kannattaa harjoitella seuraavaksi.',
        points: [
          isDesktop
            ? 'Vieritä alas siirtyäksesi kortista seuraavaan.'
            : 'Pyyhkäise ylös siirtyäksesi kortista seuraavaan.',
          'Syöte rakentuu tavoitearvosanastasi ja esitiedoistasi. Täytä kurssiarvosanasi heti ensimmäisestä kortista.',
          isDesktop
            ? 'Valitse tehtävätyypit, vaikeustaso ja kurssien järjestys oikean yläkulman Syötteen asetukset -napista.'
            : 'Valitse tehtävätyypit, vaikeustaso ja kurssien järjestys oikean yläkulman asetusnapista.',
        ],
      }
    case 'kurssit':
      return {
        label: LABELS.kurssit,
        icon: <BookIcon />,
        title: 'Kurssit',
        lead: 'Kaikki matematiikan kurssit omina kokonaisuuksinaan, kun haluat harjoitella tiettyä aihetta.',
        points: isDesktop
          ? [
              'Valitse kurssi vasemmasta sivupalkista. Palkki kertoo, kuinka paljon kurssista olet jo tehnyt.',
              'Jokaisella kurssilla on Oppimistavoitteet, Tiivistelmä ja Tehtävät.',
              'Pienennä sivupalkki, kun haluat tehtäville enemmän tilaa.',
            ]
          : [
              'Valitse kurssi listalta. Palkki kertoo, kuinka paljon kurssista olet jo tehnyt.',
              'Kurssi avautuu syötteenä: ensin käsite, heti perään sen harjoitukset ja lopuksi pitkät tehtävät.',
              'Pääset takaisin kurssilistaan Takaisin kursseihin -napista tai napauttamalla Kurssit-välilehteä.',
            ],
      }
    case 'osaaminen':
      return {
        label: LABELS.osaaminen,
        icon: <ChartIcon />,
        title: 'Osaaminen',
        lead: 'Arvosanaennusteesi ja edistymisesi yhdellä silmäyksellä.',
        points: [
          'Ennustettu arvosana lähtee esitiedoistasi ja tarkentuu sitä mukaa, kun vastaat tehtäviin.',
          `${isDesktop ? 'Napsauta' : 'Napauta'} Tavoitearvosanaa vaihtaaksesi tavoitetta. Se ohjaa myös Suositellut-syötettä.`,
          'Edistyminen ajan mittaan näyttää, miten osaamisesi kehittyy kohti tavoitetta.',
        ],
      }
  }
}

// One onboarding step per main section, shown the first time the section
// is opened: a bottom sheet on phones, a centred dialog on laptops.
export default function SectionOnboarding({ section, seen, onDone, onStart, onGoTo }: SectionOnboardingProps) {
  const { isDesktop } = useLayout()
  const step = getStep(section, isDesktop)
  const dialogRef = useRef<HTMLDivElement>(null)
  const index = ONBOARDING_SECTIONS.indexOf(section)
  // The next section not yet introduced, in menu order after this one.
  const next = [...ONBOARDING_SECTIONS.slice(index + 1), ...ONBOARDING_SECTIONS.slice(0, index)].find(
    (s) => !seen[s],
  )

  useEffect(() => {
    // Focus the dialog, not a button, so no focus ring shows until the
    // student starts tabbing.
    dialogRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDone()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDone])

  const progress = (
    <ol className="flex items-center gap-1.5" aria-label="Esittelyn osiot">
      {ONBOARDING_SECTIONS.map((s) => {
        const current = s === section
        const done = !current && seen[s]
        return (
          <li
            key={s}
            aria-current={current ? 'step' : undefined}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              current
                ? 'bg-accent text-white'
                : done
                  ? 'bg-good/15 text-good'
                  : 'bg-surface-2 text-ink-dim ring-1 ring-ink/10'
            }`}
          >
            {done && <CheckIcon className="h-3 w-3" />}
            {LABELS[s]}
          </li>
        )
      })}
    </ol>
  )

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        {progress}
        <button
          type="button"
          onClick={onDone}
          aria-label="Sulje esittely"
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink ring-1 ring-ink/10"
        >
          <XIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className={`flex items-center gap-3 ${isDesktop ? 'mt-5' : 'mt-4'}`}>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent [&>svg]:h-6 [&>svg]:w-6">
          {step.icon}
        </span>
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">
            Osio {index + 1}/{ONBOARDING_SECTIONS.length}
          </span>
          <h2 id="onboarding-title" className="text-2xl font-bold leading-tight text-ink">
            {step.title}
          </h2>
        </div>
      </div>
      <p className={`mt-3 leading-relaxed text-ink-dim ${isDesktop ? 'text-base' : 'text-sm'}`}>{step.lead}</p>

      <ol className={`flex flex-col ${isDesktop ? 'mt-5 gap-3' : 'mt-4 gap-2'}`}>
        {step.points.map((point, i) => (
          <li
            key={i}
            className={`flex gap-3 rounded-2xl bg-surface-2 px-4 text-sm leading-relaxed text-ink ${
              isDesktop ? 'py-3' : 'py-2.5'
            }`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="min-w-0">{point}</span>
          </li>
        ))}
      </ol>

      <div className={`flex gap-2 ${isDesktop ? 'mt-6 items-center justify-end' : 'mt-5 flex-col-reverse'}`}>
        {next && (
          <button
            type="button"
            onClick={() => onGoTo(next)}
            className="flex items-center justify-center gap-1 rounded-full px-5 py-2.5 text-sm font-semibold text-accent ring-1 ring-accent/30 transition-colors hover:bg-accent/10"
          >
            Seuraavaksi: {LABELS[next]}
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onStart}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-md outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Selvä, aloitetaan
        </button>
      </div>
    </>
  )

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className={`fixed inset-0 z-[80] flex bg-ink/30 backdrop-blur-[2px] ${
        isDesktop ? 'items-center justify-center p-6' : 'items-end'
      }`}
      onClick={onDone}
    >
      <motion.div
        key={section}
        initial={isDesktop ? { opacity: 0, scale: 0.96 } : { y: '100%' }}
        animate={isDesktop ? { opacity: 1, scale: 1 } : { y: 0 }}
        transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
        ref={dialogRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={`outline-none ${
          isDesktop
            ? 'max-h-full w-[32rem] max-w-full overflow-y-auto rounded-3xl bg-surface p-7 shadow-2xl'
            : 'max-h-[90dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-surface px-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-6 shadow-2xl'
        }`}
      >
        {body}
      </motion.div>
    </div>,
    document.body,
  )
}
