// Minimal, dependency-free SVG icons (24x24, stroke-based).
// Kept in one file so the app doesn't need an icon library.

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function ClockIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  )
}

export function ZapIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2 4 14h6l-1 8 9-13h-6l1-7z" strokeLinejoin="round" />
    </svg>
  )
}

export function RocketIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2c2.8 1.6 4.5 4.6 4.5 8.3 0 2.4-.8 4.6-2.1 6.2l-2.4 2.6-2.4-2.6C8.3 14.9 7.5 12.7 7.5 10.3 7.5 6.6 9.2 3.6 12 2z" />
      <circle cx="12" cy="9.5" r="1.8" />
      <path d="M8.3 15.5 6 18.2M15.7 15.5 18 18.2M10.5 19.5 12 22l1.5-2.5" />
    </svg>
  )
}

export function SparkleIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M7 7l2 2M15 15l2 2M17 7l-2 2M9 15l-2 2" />
    </svg>
  )
}

export function ListIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" />
      <circle cx="4.5" cy="18" r="1" fill="currentColor" />
    </svg>
  )
}

export function ChartIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  )
}

export function PlusIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function PencilIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20h4L19.5 8.5a1.7 1.7 0 0 0 0-2.4l-1.6-1.6a1.7 1.7 0 0 0-2.4 0L4 16v4z" />
    </svg>
  )
}

export function TrashIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M7 7l1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" />
    </svg>
  )
}

export function ArrowLeftIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  )
}

export function ArrowRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
