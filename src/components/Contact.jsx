import Reveal from './Reveal.jsx'
import Zero from './Zero.jsx'
import { contact } from '../data/content.js'

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <Reveal>
        <h2><Zero>{contact.title}</Zero></h2>
        <a className="contact__email" href={`mailto:${contact.email}`}><Zero>{contact.email}</Zero></a>
      </Reveal>
    </section>
  )
}
