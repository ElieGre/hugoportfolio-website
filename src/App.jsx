import Background from './components/Background.jsx'
import Grain from './components/Grain.jsx'
import Hero from './components/Hero.jsx'
import Timeline from './components/Timeline.jsx'
import About from './components/About.jsx'
import Gear from './components/Gear.jsx'
import Projects from './components/Projects.jsx'
import Contact from './components/Contact.jsx'

export default function App() {
  return (
    <>
      <Background />
      <Grain />
      <main>
        <Hero name="Hugo" />
        <Timeline />
        <About />
        <Gear />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
