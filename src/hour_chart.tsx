import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"

type Day = {
  date: string
  hours: number
  mood: number
}

export default function HourChart({ data }: { data: Day[] }) {
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
