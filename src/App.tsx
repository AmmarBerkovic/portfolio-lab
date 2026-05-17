import Nav from './components/Nav'
import CommandCenter from './components/CommandCenter'
import './App.css'

function App() {
  return (
    <>
      <Nav />
      <main>
        <CommandCenter />
        <section id="core-stack"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>CORE_STACK</p></div></section>
        <section id="experience-logs"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>EXPERIENCE_LOGS</p></div></section>
        <section id="active-projects"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>ACTIVE_PROJECTS</p></div></section>
        <section id="contact-uplink"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>CONTACT_UPLINK</p></div></section>
      </main>
    </>
  )
}

export default App
