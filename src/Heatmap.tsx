import CalendarHeatmap from "react-calendar-heatmap"
import "react-calendar-heatmap/dist/styles.css"
import "./globals.css"

type Day = {
  date: string
  work_hours: number
}

function generateData(days = 14) {
  const data = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      hours: Math.floor(Math.random() * 9)
    })
  }

  return data
}

// export default function WorkHeatmap({ data }: { data: Day[] }) {
export default function WorkHeatmap() {

  function getClass(value: Day | null) {
    if (!value) return "color-empty"
    if (value.work_hours < 2) return "color-scale-1"
    if (value.work_hours < 4) return "color-scale-2"
    if (value.work_hours < 6) return "color-scale-3"
    return "color-scale-4"
  }

  return (
    <CalendarHeatmap
      startDate={new Date("2026-01-28")}
      endDate={new Date()}
      values={generateData(30)}
      classForValue={getClass}
    />
  )
}
