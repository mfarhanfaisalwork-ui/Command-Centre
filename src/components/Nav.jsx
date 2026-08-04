import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-brand">Command Center</div>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}>
          Home
        </NavLink>
        <NavLink
          to="/nifar"
          className={({ isActive }) => (isActive ? 'nav-link nav-link-active nav-link-nifar' : 'nav-link nav-link-nifar')}
        >
          NIFAR
        </NavLink>
        <NavLink
          to="/nifarise"
          className={({ isActive }) => (isActive ? 'nav-link nav-link-active nav-link-nifarise' : 'nav-link nav-link-nifarise')}
        >
          Nifarise
        </NavLink>
      </div>
    </nav>
  )
}
