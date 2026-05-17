import Nav from './components/Nav'
import CommandCenter from './components/CommandCenter'
import CoreStack from './components/CoreStack'
import ExperienceLogs from './components/ExperienceLogs'
import ActiveProjects from './components/ActiveProjects'
import ContactUplink from './components/ContactUplink'
import './App.css'

function App() {
  return (
    <>
      <Nav />
      <main>
        <CommandCenter />
        <CoreStack />
        <ExperienceLogs />
        <ActiveProjects />
        <ContactUplink />
      </main>
    </>
  )
}

export default App
