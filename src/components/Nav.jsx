import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const LINKS = [
  { to: '/', label: 'Home', end: true, cls: '' },
  { to: '/nifar', label: 'NIFAR', end: false, cls: 'nav-link-nifar' },
  { to: '/nifarise', label: 'Nifarise', end: false, cls: 'nav-link-nifarise' },
]

export default function Nav() {
  const location = useLocation()

  return (
    <nav className="nav">
      <div className="nav-brand">
        <span className="nav-brand-dot" aria-hidden="true" />
        COMMAND_CENTER
      </div>
      <div className="nav-links">
        {LINKS.map((link) => {
          const isActive = link.end ? location.pathname === '/' : location.pathname.startsWith(link.to)
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={`nav-link ${link.cls} ${isActive ? 'nav-link-active' : ''}`}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="nav-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="nav-link-text">{link.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
