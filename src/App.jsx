import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import BusinessPage from './pages/BusinessPage'
import useTasks from './hooks/useTasks'
import useSocialStats from './hooks/useSocialStats'

const NIFAR_PLATFORMS = ['YouTube', 'Instagram', 'Facebook', 'TikTok', 'Pinterest']
const NIFARISE_PLATFORMS = ['LinkedIn', 'Instagram', 'YouTube']

export default function App() {
  const { tasks, loading: tasksLoading } = useTasks()
  const { stats, loading: statsLoading } = useSocialStats()

  return (
    <div className="app">
      <Nav />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home tasks={tasks} loading={tasksLoading} />} />
          <Route
            path="/nifar"
            element={
              <BusinessPage
                title="NIFAR"
                tagline="Minecraft digital products · Whop"
                business="nifar"
                accentClass="theme-nifar"
                platforms={NIFAR_PLATFORMS}
                tasks={tasks}
                stats={stats}
                loading={tasksLoading || statsLoading}
              />
            }
          />
          <Route
            path="/nifarise"
            element={
              <BusinessPage
                title="Nifarise"
                tagline="Rise with AI · Pre-launch"
                business="nifarise"
                accentClass="theme-nifarise"
                platforms={NIFARISE_PLATFORMS}
                tasks={tasks}
                stats={stats}
                loading={tasksLoading || statsLoading}
              />
            }
          />
        </Routes>
      </main>
    </div>
  )
}
