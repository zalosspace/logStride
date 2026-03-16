import { useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
)

function randomMood() {
  return Math.floor(Math.random() * 3) // 0 bad, 1 mid, 2 good
}

function randomHours(date: Date) {
  const day = date.getDay()

  if (day === 0 || day === 6) {
    return Math.floor(Math.random() * 2) // weekend
  }

  return Math.floor(Math.random() * 8) + 1 // weekday
}

export default function SeedData() {

  async function seed() {

    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) {
      console.error("User not logged in")
      return
    }

    const rows = []

    for (let i = 0; i < 90; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      rows.push({
        user_id: user.id,
        date: date.toISOString().split("T")[0],
        hours: randomHours(date),
        mood: randomMood()
      })
    }

    const { error } = await supabase
      .from("days")
      .upsert(rows, { onConflict: "user_id,date" })

    if (error) {
      console.error(error)
    } else {
      console.log("90 days seeded")
    }
  }

  useEffect(() => {
    seed()
  }, [])

  return <div>Seeding sample data...</div>
}
