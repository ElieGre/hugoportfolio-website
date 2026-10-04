// Site-wide rule: every "o" is shown as a thin slashed "0" (terminal-style).
export function zero(text) {
  return String(text)
    .split(/([oO])/)
    .map((part, i) =>
      part === 'o' || part === 'O' ? <span className="zero" key={i}>0</span> : part
    )
}

export default function Zero({ children }) {
  return <>{zero(children)}</>
}
