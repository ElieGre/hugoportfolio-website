import { useEffect, useRef } from 'react'
import { zero } from './Zero.jsx'

// Starts centered. Once the user scrolls, the name bounces around the viewport like the
// DVD logo; back at the top it eases to the center again. Over content (images, cards,
// text) the letters show that content's negative.
const SPEED = { x: 45, y: 20 } // px per second

export default function Hero({ name }) {
  const ref = useRef(null)
  const negRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    const neg = negRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let x = 0, y = 0, w = 0, h = 0
    let vx = SPEED.x, vy = SPEED.y
    let last = performance.now()
    let raf = 0

    const center = () => ({
      x: Math.max(0, (window.innerWidth - w) / 2),
      y: Math.max(0, (window.innerHeight - h) / 2),
    })

    const measure = () => {
      w = el.offsetWidth
      h = el.offsetHeight
    }

    // Two copies of the name. The normal one (black + white outline) is clipped to everything
    // EXCEPT content; the `negative` copy (white, blend: difference) is clipped to ONLY the
    // content (images, cards, text lines), so over content the letters show its negative.
    // Clips are in the elements' local coordinates (they are translated by x, y).
    const BOXES = '.project__thumb, .timeline__media, .gear__item, .about__video video, .video-placeholder'
    const TEXT = '.timeline__year, .timeline__caption, h2, h3, p, .contact__email, .gear__cat, .gear__name, .project__meta span'
    const rr = (l, t, r, b, rad) =>
      `M${l + rad} ${t}H${r - rad}A${rad} ${rad} 0 0 1 ${r} ${t + rad}V${b - rad}A${rad} ${rad} 0 0 1 ${r - rad} ${b}` +
      `H${l + rad}A${rad} ${rad} 0 0 1 ${l} ${b - rad}V${t + rad}A${rad} ${rad} 0 0 1 ${l + rad} ${t}Z`
    const range = document.createRange()
    const updateClip = () => {
      const vh = window.innerHeight
      let d = ''
      document.querySelectorAll(BOXES).forEach((n) => {
        const r = n.getBoundingClientRect()
        if (r.bottom < 0 || r.top > vh || !r.width) return
        const rad = parseFloat(getComputedStyle(n).borderTopLeftRadius) || 0
        d += rr(r.left - x, r.top - y, r.right - x, r.bottom - y, Math.min(rad, r.width / 2, r.height / 2))
      })
      document.querySelectorAll(TEXT).forEach((n) => {
        const b = n.getBoundingClientRect()
        if (b.bottom < 0 || b.top > vh) return
        range.selectNodeContents(n)
        for (const r of range.getClientRects()) {
          if (!r.width || !r.height) continue
          d += `M${r.left - x} ${r.top - y}H${r.right - x}V${r.bottom - y}H${r.left - x}Z`
        }
      })
      neg.style.clipPath = d ? `path('${d}')` : 'inset(100%)'
      el.style.clipPath = d ? `path(evenodd, 'M-20000 -20000H20000V20000H-20000Z${d}')` : 'none'
    }

    const place = () => {
      const t = `translate(${x}px, ${y}px)`
      el.style.transform = t
      neg.style.transform = t
      updateClip()
    }

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (window.scrollY > 4) {
        x += vx * dt
        y += vy * dt
        const maxX = Math.max(0, window.innerWidth - w)
        const maxY = Math.max(0, window.innerHeight - h)
        if (x <= 0) { x = 0; vx = Math.abs(vx) }
        else if (x >= maxX) { x = maxX; vx = -Math.abs(vx) }
        if (y <= 0) { y = 0; vy = Math.abs(vy) }
        else if (y >= maxY) { y = maxY; vy = -Math.abs(vy) }
      } else {
        const c = center()
        const k = Math.min(1, dt * 6)
        x += (c.x - x) * k
        y += (c.y - y) * k
      }
      place()
      raf = requestAnimationFrame(tick)
    }

    measure()
    ;({ x, y } = center())
    place()
    if (!reduce) raf = requestAnimationFrame(tick)
    else window.addEventListener('scroll', updateClip, { passive: true })

    const onResize = () => { measure(); if (reduce) { ({ x, y } = center()); place() } }
    document.fonts?.ready.then(() => { measure(); if (reduce) { ({ x, y } = center()); place() } })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', updateClip)
    }
  }, [])

  return (
    <section className="hero">
      <h1 className="hero__title" ref={ref} aria-label={name}>{zero(name)}</h1>
      <div className="hero__title hero__title--negative" ref={negRef} aria-hidden="true">{zero(name)}</div>
      <span className="hero__hint" aria-hidden="true">scroll</span>
    </section>
  )
}
