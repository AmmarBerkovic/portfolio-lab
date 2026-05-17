import Nav from './components/Nav'
import CommandCenter from './components/CommandCenter'
import CoreStack from './components/CoreStack'
import ExperienceLogs from './components/ExperienceLogs'
import ActiveProjects from './components/ActiveProjects'
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
        <section id="contact-uplink"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>CONTACT_UPLINK</p></div></section>
      </main>
    </>
  )
}

export default App
