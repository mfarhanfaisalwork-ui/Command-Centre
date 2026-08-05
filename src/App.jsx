import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Nav from './components/Nav'
import Home from './pages/Home'
import BusinessPage from './pages/BusinessPage'
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
  const { weekTasks, loading: tasksLoading } = useWeekTasks()
  const { milestones, loading: milestonesLoading } = useMilestones()
  const location = useLocation()

  return (
    <div className="app">
      <Nav />
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
                    tagline="Minecraft digital products · Whop"
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
                    tagline="Rise with AI · Pre-launch"
                    business="nifarise"
                    accentClass="theme-nifarise"
                    weekTasks={weekTasks}
                    milestones={milestones}
                    loading={tasksLoading || milestonesLoading}
                  />
                </AnimatedPage>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}
