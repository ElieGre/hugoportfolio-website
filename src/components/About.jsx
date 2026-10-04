import Reveal from './Reveal.jsx'
import Zero from './Zero.jsx'
import { about } from '../data/content.js'

export default function About() {
  return (
    <section className="section about" id="about">
      <Reveal className="about__text">
        <h2><Zero>{about.title}</Zero></h2>
        {about.paragraphs.map((p, i) => (
          <p key={i}><Zero>{p}</Zero></p>
        ))}
      </Reveal>
      <Reveal className="about__video" delay={150}>
        {about.videoSrc ? (
          <video src={about.videoSrc} poster={about.videoPoster} controls playsInline muted loop />
        ) : (
          <div className="video-placeholder"><Zero>Video goes here</Zero></div>
        )}
      </Reveal>
    </section>
  )
}
