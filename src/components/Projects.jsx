import Reveal from './Reveal.jsx'
import Zero from './Zero.jsx'
import { projects } from '../data/content.js'

export default function Projects() {
  return (
    <section className="section" id="projects">
      <Reveal as="h2"><Zero>{projects.title}</Zero></Reveal>
      <div className="projects">
        {projects.items.map((p, i) => (
          <Reveal key={i} delay={(i % 2) * 120}>
            <a className="project" href={p.link}>
              <div className="project__thumb">
                {p.image && <img src={p.image} alt="" loading="lazy" />}
              </div>
              <div className="project__meta">
                <h3><Zero>{p.name}</Zero></h3>
                <span><Zero>{p.year}</Zero></span>
              </div>
              <p><Zero>{p.blurb}</Zero></p>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
