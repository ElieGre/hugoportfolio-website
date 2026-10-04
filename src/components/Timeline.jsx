import { useEffect, useRef, useState } from 'react'
import Zero from './Zero.jsx'
import { timeline } from '../data/content.js'

// Pinned timeline: the section is n screens tall and its content is sticky, so while you
// scroll through it the page appears to stop and the scroll steps through the years instead.
// After the last year the pin releases and the page scrolls on. Fully reversible.
export default function Timeline() {
  const { items } = timeline
  const n = items.length
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const r = ref.current.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0
      setProgress(p)
      setActive(Math.min(n - 1, Math.floor(p * n)))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [n])

  // clicking a year scrolls to the middle of its step
  const goTo = (i) => {
    const top = ref.current.getBoundingClientRect().top + window.scrollY
    const total = ref.current.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + ((i + 0.5) / n) * total, behavior: 'smooth' })
  }

  return (
    <section className="timeline" id="timeline" ref={ref} style={{ height: `${n * 100}vh` }}>
      <div className="timeline__pin">
        <h2 className="timeline__title"><Zero>{timeline.title}</Zero></h2>
        <div className="timeline__body">
          <ol className="timeline__rail">
            <span className="timeline__line" aria-hidden="true">
              <span className="timeline__fill" style={{ transform: `scaleY(${progress})` }} />
            </span>
            {items.map((item, i) => (
              <li key={item.year} className={i === active ? 'is-active' : i < active ? 'is-past' : ''}>
                <button onClick={() => goTo(i)}>
                  <span className="timeline__dot" />
                  <span className="timeline__year"><Zero>{item.year}</Zero></span>
                </button>
              </li>
            ))}
          </ol>
          <div className="timeline__stage">
            {items.map((item, i) => (
              <figure key={item.year} className={`timeline__slide ${i === active ? 'is-active' : ''}`}>
                <div className="timeline__media">
                  <img src={item.image} alt="" loading="lazy" />
                </div>
                <figcaption className="timeline__caption"><Zero>{item.caption}</Zero></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
