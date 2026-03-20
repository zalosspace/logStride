import { useState, useRef } from "react"

export default function Timer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  const intervalRef = useRef<number | null>(null)

  function start() {
    if (running) return

    setRunning(true)

    intervalRef.current = window.setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
  }

  function stop() {
    setRunning(false)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function reset() {
    stop()
    setSeconds(0)
  }

  function formatTime(sec: number) {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60

    return [h, m, s]
      .map((v) => v.toString().padStart(2, "0"))
      .join(":")
  }

  return (
    <div className="flex flex-col items-center gap-4">
      
      <h1 className="text-5xl font-mono">
        {formatTime(seconds)}
      </h1>

      <div className="flex gap-3">
        <button onClick={start}>Start</button>
        <button onClick={stop}>Stop</button>
        <button onClick={reset}>Reset</button>
      </div>

    </div>
  )
}
