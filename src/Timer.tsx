import { useState, useEffect, useRef } from "react"

export default function Timer() {
  const [seconds, setSeconds] = useState<number>(() => fetchTime())
  const [running, setRunning] = useState(false)

  const intervalRef = useRef<number | null>(null)

    useEffect(() => {
        fetchTime()
    }, [])

    useEffect(() => {
        localStorage.setItem("timer_seconds", JSON.stringify(seconds))
    }, [seconds])

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    function fetchTime() {
        const lastTime = localStorage.getItem("timer_seconds")
        if (lastTime === null) return 0

        const seconds = JSON.parse(lastTime)
        return isNaN(seconds) ? 0 : seconds
    }

  function start() {
    if (running) return

    setRunning(true)

    intervalRef.current = window.setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
  }

  function stop() {
    setRunning(false)

    if (intervalRef.current !== null) {
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
        <>
            <h2 className="text-zinc-200 text-lg font-semibold px-8 py-6 absolute top-0 left-0">
                Timer
            </h2>

            <div className="w-full">
                <div className="mt-6 flex flex-col items-center gap-4">
                    <h1 className="text-7xl font-mono tracking-tight text-white drop-shadow-lg">
                        {formatTime(seconds)}
                    </h1>

                    <button
                        onClick={running ? stop : start}
                        className="w-14 h-14 flex items-center justify-center 
                        rounded-full bg-[var(--hint)] text-white 
                        shadow-lg hover:scale-105 hover:shadow-[0_0_10px_var(--hint)]
                        transition-all duration-200"
                    >
                        {running ? (
                            // Pause Icon
                            <svg width="20" height="20" fill="currentColor">
                                <rect x="3" y="2" width="5" height="16" rx="1" />
                                <rect x="12" y="2" width="5" height="16" rx="1" />
                            </svg>
                        ) : (
                                // Play Icon
                                <svg width="20" height="20" fill="currentColor">
                                    <polygon points="4,2 18,10 4,18" />
                                </svg>
                            )}
                    </button>

                    <button
                        onClick={reset}
                        className="text-zinc-400 hover:text-white text-sm 
                        transition-all duration-200"
                    >
                        Reset
                    </button>

                </div>
            </div>

        </>

    )
}
