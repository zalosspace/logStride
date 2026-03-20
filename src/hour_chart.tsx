import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import {
    AreaChart,
    BarChart,
    Bar,
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

const options = [
    { label: "30 days", value: 30 },
    { label: "90 days", value: 90 }
]

export default function HourChart({ 
    data, 
    fetchHours 
}: { 
        data: Day[], 
        fetchHours: (days: number) => void 
    }) {
    return (
        <>
            <select className="opt-dropdown" onChange={(e) => fetchHours(Number(e.target.value))}>             {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
            </select>
            <div className="w-full h-[300px]">
                {/* <ResponsiveContainer> */}
                {/*     <AreaChart data={data}> */}
                {/*         <defs> */}
                {/*             <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1"> */}
                {/*                 <stop offset="0%" stopColor="#ff0077" stopOpacity={1} /> */}
                {/*                 <stop offset="100%" stopColor="#ff0077" stopOpacity={0.2} /> */}
                {/*             </linearGradient> */}
                {/*         </defs> */}
                {/**/}
                {/*         <CartesianGrid strokeDasharray="3 3" /> */}
                {/*         <XAxis dataKey="date" /> */}
                {/*         <YAxis /> */}
                {/*         <Tooltip /> */}
                {/**/}
                {/*         <Area */}
                {/*             type="monotone" */}
                {/*             dataKey="hours" */}
                {/*             stroke="#b91c1c"    */}
                {/*             fill="url(#colorHours)"  */}
                {/*         /> */}
                {/*     </AreaChart> */}
                {/* </ResponsiveContainer>     */}

                <ResponsiveContainer className="translate-x-[-2%]">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />

                        <Bar
                            dataKey="hours"
                            fill="#ff0077"
                            radius={[6, 6, 0, 0]} // rounded top corners 😏
                        />
                    </BarChart>
                </ResponsiveContainer>

            </div>
        </>
    )
}
