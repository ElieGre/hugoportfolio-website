import Reveal from './Reveal.jsx'
import Zero from './Zero.jsx'
import { gear } from '../data/content.js'

export default function Gear() {
  return (
    <section className="section" id="gear">
      <Reveal as="h2"><Zero>{gear.title}</Zero></Reveal>
      <ul className="gear">
        {gear.items.map((item, i) => (
          <Reveal as="li" key={i} delay={i * 80} className="gear__item">
            <span className="gear__cat"><Zero>{item.category}</Zero></span>
            <span className="gear__name"><Zero>{item.name}</Zero></span>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
