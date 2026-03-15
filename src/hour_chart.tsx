import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"

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

export default function HourChart() {
  const data = generateData(30)

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="#6366f1"
            fill="#6366f1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
