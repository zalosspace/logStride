import { useState } from "react"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
)

export default function LogData() {
  const today = new Date().toISOString().split("T")[0]

  const [date, setDate] = useState(today)
  const [hours, setHours] = useState<number | "">("")
  const [mood, setMood] = useState(5)
  const [focus, setFocus] = useState(5)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  async function saveDay() {
    if (hours === "") {
      setMsg("Enter work hours.")
      return
    }

    setLoading(true)
    setMsg("")

    const { error } = await supabase
      .from("work_day")
      .upsert({
        date,
        work_hours: hours,
        mood,
        focus_score: focus,
        notes
      }, { onConflict: "date" })

    if (error) {
      setMsg(error.message)
    } else {
      setMsg("Day logged successfully")
      setNotes("")
    }

    setLoading(false)
  }

  return (
    <div style={{maxWidth: 400, margin: "auto"}}>
      <h2>Log Your Day</h2>

      <label>Date</label>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />

      <label>Work Hours</label>
      <input
        type="number"
        step="0.1"
        value={hours}
        onChange={e => setHours(parseFloat(e.target.value))}
      />

      <label>Mood: {mood}</label>
      <input
        type="range"
        min="0"
        max="10"
        value={mood}
        onChange={e => setMood(parseInt(e.target.value))}
      />

      <label>Focus: {focus}</label>
      <input
        type="range"
        min="0"
        max="10"
        value={focus}
        onChange={e => setFocus(parseInt(e.target.value))}
      />

      <label>Notes</label>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />

      <button onClick={saveDay} disabled={loading}>
        {loading ? "Saving..." : "Save Day"}
      </button>

      {msg && <p>{msg}</p>}
    </div>
  )
}
