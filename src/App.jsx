import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import Home from './pages/Home'
import BusinessPage from './pages/BusinessPage'
import Report from './pages/Report'
import useAuth from './hooks/useAuth'
import useWeekTasks from './hooks/useWeekTasks'
import useMilestones from './hooks/useMilestones'

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.22, ease: 'easeOut' },
}

function AnimatedPage({ children }) {
  return <motion.div {...pageTransition}>{children}</motion.div>
}

export default function App() {
  const { user, checking } = useAuth()

  // Firebase needs a moment to restore the session from local storage. Rendering
  // nothing here stops the login screen from flashing on every page refresh.
  if (checking) return null
  if (!user) return <Login />

  return <Dashboard />
}

/**
 * Split out so the Firestore hooks below only ever run for a signed-in user.
 * If they lived in App they would fire before login and hit permission errors.
 */
function Dashboard() {
  const { weekTasks, loading: tasksLoading } = useWeekTasks()
  const { milestones, loading: milestonesLoading } = useMilestones()
  const location = useLocation()

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <AnimatedPage>
                  <Home weekTasks={weekTasks} loading={tasksLoading} />
                </AnimatedPage>
              }
            />
            <Route
              path="/nifar"
              element={
                <AnimatedPage>
                  <BusinessPage
                    title="NIFAR"
                    tagline="Digital products · Whop"
                    business="nifar"
                    accentClass="theme-nifar"
                    weekTasks={weekTasks}
                    milestones={milestones}
                    loading={tasksLoading || milestonesLoading}
                  />
                </AnimatedPage>
              }
            />
            <Route
              path="/nifarise"
              element={
                <AnimatedPage>
                  <BusinessPage
                    title="Nifarise"
                    tagline="AI automation · Pre-launch"
                    business="nifarise"
                    accentClass="theme-nifarise"
                    weekTasks={weekTasks}
                    milestones={milestones}
                    loading={tasksLoading || milestonesLoading}
                  />
                </AnimatedPage>
              }
            />
            <Route
              path="/report"
              element={
                <AnimatedPage>
                  <Report weekTasks={weekTasks} loading={tasksLoading} />
                </AnimatedPage>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}
