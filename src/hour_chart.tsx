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
                    <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ff0077" stopOpacity={1} />
                            <stop offset="100%" stopColor="#ff0077" stopOpacity={0.2} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />

                    <Area
                        type="monotone"
                        dataKey="hours"
                        stroke="#b91c1c"   
                        fill="url(#colorHours)" 
                    />
                </AreaChart>
            </ResponsiveContainer>    

        </div>
    )
}
