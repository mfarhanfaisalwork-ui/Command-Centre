import { NavLink, useLocation } from 'react-router-dom'
import { ChartIcon, RocketIcon, SparkleIcon, ListIcon } from './Icons'

const LINKS = [
  { to: '/', label: 'Dashboard', end: true, Icon: ChartIcon, cls: '' },
  { to: '/nifar', label: 'NIFAR', end: false, Icon: RocketIcon, cls: 'side-link-nifar' },
  { to: '/nifarise', label: 'Nifarise', end: false, Icon: SparkleIcon, cls: 'side-link-nifarise' },
  { to: '/report', label: 'Report', end: false, Icon: ListIcon, cls: '' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark" aria-hidden="true" />
        <span className="sidebar-brand-text">Command</span>
      </div>

      <nav className="sidebar-nav">
        {LINKS.map(({ to, label, end, Icon, cls }) => {
          const isActive = end ? location.pathname === '/' : location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={`side-link ${cls} ${isActive ? 'side-link-active' : ''}`}
            >
              <Icon width={17} height={17} />
              <span>{label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-foot">
        <span className="sidebar-foot-label">Businesses</span>
        <span className="sidebar-foot-item">
          <i className="dot dot-nifar" /> NIFAR
        </span>
        <span className="sidebar-foot-item">
          <i className="dot dot-nifarise" /> Nifarise
        </span>
      </div>
    </aside>
  )
}
