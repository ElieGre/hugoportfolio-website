import { useEffect, useRef } from 'react'

// Film grain overlay drawn on one fixed canvas (no WebGL, no moving layers, so nothing can
// tear or glitch). Cosmetic only: it never distorts anything and gets stronger as you scroll.
const MIN = 0.08 // opacity at the top of the page
const MAX = 0.2 // opacity at the bottom
const FPS = 12
const SCALE = 2 // each grain particle is SCALE x SCALE css pixels

export default function Grain() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let img
    const resize = () => {
      canvas.width = Math.ceil(window.innerWidth / SCALE)
      canvas.height = Math.ceil(window.innerHeight / SCALE)
      img = ctx.createImageData(canvas.width, canvas.height)
      draw()
    }
    const draw = () => {
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() > 0.5 ? 255 : 0
        d[i] = d[i + 1] = d[i + 2] = v
        d[i + 3] = Math.random() * 120
      }
      ctx.putImageData(img, 0, 0)
    }

    let cur = MIN
    let target = MIN
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      target = MIN + (MAX - MIN) * p
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let lastDraw = 0
    const tick = (now) => {
      cur += (target - cur) * 0.1
      canvas.style.opacity = cur
      if (!reduce && now - lastDraw > 1000 / FPS) {
        lastDraw = now
        draw()
      }
      raf = requestAnimationFrame(tick)
    }
    resize()
    onScroll()
    cur = target
    raf = requestAnimationFrame(tick)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas className="grain" ref={ref} aria-hidden="true" />
}
