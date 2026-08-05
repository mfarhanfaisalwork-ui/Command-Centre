import { useRef } from 'react'

/**
 * Wraps children in a card that tilts gently toward the cursor on hover
 * and relaxes back to flat on leave. Pure CSS custom-property driven, no
 * animation library needed. Disabled automatically on touch devices via
 * pointer:fine media query in CSS.
 */
export default function TiltCard({ children, className = '', as: As = 'div', ...rest }) {
  const ref = useRef(null)

  function handleMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--tilt-x', `${(-py * 6).toFixed(2)}deg`)
    el.style.setProperty('--tilt-y', `${(px * 6).toFixed(2)}deg`)
    el.style.setProperty('--glow-x', `${(px * 0.5 + 0.5) * 100}%`)
    el.style.setProperty('--glow-y', `${(py * 0.5 + 0.5) * 100}%`)
  }

  function handleLeave() {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
  }

  return (
    <As
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      <div className="tilt-card-inner">{children}</div>
    </As>
  )
}
