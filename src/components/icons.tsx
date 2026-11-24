interface IconProps {
  className?: string
}

export function BookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M4 5.5C4 4.67 4.67 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" strokeLinejoin="round" />
      <path d="M20 5.5c0-.83-.67-1.5-1.5-1.5H12v16h6.5c.83 0 1.5-.67 1.5-1.5v-13Z" strokeLinejoin="round" />
    </svg>
  )
}

export function ListCheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="m4 7 1.8 1.8L9 5.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4 15 1.8 1.8L9 13.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 7h7M13 15h7" strokeLinecap="round" />
    </svg>
  )
}

export function PencilIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path
        d="M4 20l.9-4.5L15.6 4.8a1.5 1.5 0 0 1 2.1 0l1.5 1.5a1.5 1.5 0 0 1 0 2.1L8.5 19.1 4 20Z"
        strokeLinejoin="round"
      />
      <path d="m14 6.5 3.5 3.5" strokeLinecap="round" />
    </svg>
  )
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}>
      <path d="m5 12.5 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}>
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  )
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function InfoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx={12} cy={12} r={9} />
      <path d="M12 11v5" strokeLinecap="round" />
      <circle cx={12} cy={8} r={0.6} fill="currentColor" />
    </svg>
  )
}

export function SlidersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" strokeLinecap="round" />
      <circle cx={15} cy={7} r={2} />
      <circle cx={9} cy={17} r={2} />
    </svg>
  )
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

export function MathSymbolIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M3 13h2.5l2.7 6L12.5 5H21" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m14.5 10 5 5M19.5 10l-5 5" strokeLinecap="round" />
    </svg>
  )
}

export function ExpandIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path
        d="M15 3h6v6M21 3l-7 7M9 21H3v-6M3 21l7-7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CopyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <rect x={9} y={9} width={11} height={11} rx={2} />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" strokeLinecap="round" />
    </svg>
  )
}

export function SparkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path
        d="M12 3.5 13.9 9a1.5 1.5 0 0 0 .9.9l5.7 2.1-5.7 2.1a1.5 1.5 0 0 0-.9.9L12 20.5 10.1 15a1.5 1.5 0 0 0-.9-.9L3.5 12l5.7-2.1a1.5 1.5 0 0 0 .9-.9L12 3.5Z"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M4 4v16h16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m8 15 3.5-4 3 2.5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
