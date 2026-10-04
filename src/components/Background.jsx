import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Slow liquid-gradient background in the site palette. (Film grain lives in Grain.jsx so it
// still shows when WebGL is unavailable.)

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;

  // palette (sRGB)
  const vec3 BLACK   = vec3(0.051, 0.051, 0.071); // #0d0d12
  const vec3 PURPLE  = vec3(0.357, 0.204, 0.788); // #5b34c9
  const vec3 GREY    = vec3(0.290, 0.290, 0.333); // #4a4a55
  const vec3 ORANGE  = vec3(1.000, 0.478, 0.161); // #ff7a29

  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * vec2(uRes.x / uRes.y, 1.0);
    float t = uTime * 0.05;

    // two layers of slowly drifting noise; the mouse nudges the flow a little
    vec2 drift = (uMouse - 0.5) * 0.3;
    float n1 = fbm(p * 1.4 + vec2(t, -t * 0.7) + drift);
    float n2 = fbm(p * 1.1 + vec2(-t * 0.8, t) + n1 * 0.8);
    float n3 = fbm(p * 2.0 + vec2(t * 0.5, t * 0.3) + n2);

    vec3 col = BLACK;
    col = mix(col, PURPLE, smoothstep(0.35, 0.85, n2) * 0.55);
    col = mix(col, GREY,   smoothstep(0.5, 0.95, n1) * 0.35);
    col += ORANGE * smoothstep(0.7, 1.0, n3) * 0.06;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function Background() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
    } catch (err) {
      console.warn('WebGL unavailable, skipping background:', err)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      },
    })
    const geometry = new THREE.PlaneGeometry(2, 2)
    scene.add(new THREE.Mesh(geometry, material))

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false)
      renderer.getDrawingBufferSize(material.uniforms.uRes.value)
    }
    resize()
    window.addEventListener('resize', resize)

    const mouse = { x: 0.5, y: 0.5 }
    const onMove = (e) => {
      mouse.x = e.clientX / window.innerWidth
      mouse.y = 1 - e.clientY / window.innerHeight
    }
    window.addEventListener('pointermove', onMove)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const start = performance.now()
    const tick = () => {
      const u = material.uniforms
      u.uTime.value = reduce ? 0 : (performance.now() - start) / 1000
      u.uMouse.value.x += (mouse.x - u.uMouse.value.x) * 0.04
      u.uMouse.value.y += (mouse.y - u.uMouse.value.y) * 0.04
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={ref} className="bg-canvas" />
}
