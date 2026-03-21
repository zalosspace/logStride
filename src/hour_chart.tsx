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

    const [showModal, setShowModal] = useState(false)
    const years = Array.from(
        new Set(data.map(d => new Date(d.date).getFullYear()))
    ).sort((a, b) => b - a) 
    const [selectedYear, setSelectedYear] = useState(years[0])
    const filteredData = data.filter(
        d => new Date(d.date).getFullYear() === selectedYear
    )

    const monthlyData = groupByMonth(filteredData)
    const monthsArray = Object.entries(monthlyData)// latest year first

    function groupByMonth(data: Day[]) {
        const months: { [key: string]: Day[] } = {}

        data.forEach((item) => {
            const date = new Date(item.date)
            const key = `${date.getFullYear()}-${date.getMonth()}`

            if (!months[key]) months[key] = []
            months[key].push(item)
        })

        return months
    }

    useEffect(() => {
        if (years.length > 0) {
            setSelectedYear(years[0])
        }
    }, [data])

    return (
        <>
            <select className="opt-dropdown" onChange={(e) => fetchHours(Number(e.target.value))}>             {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
            </select>

            <button onClick={() => setShowModal(!showModal)}>Expand</button>
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
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>

            </div>

            {/* Modal */}
            {/* { showModal && ( */}
            {/*     <div className="w-[95vw] h-[90vh] p-8 bg-[var(--tertiary)] */}
            {/*         absolute bottom-0 rounded-t-3xl"> */}
            {/*         check */}
            {/*     </div> */}
            {/* )} */}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-end">

                    <div className="w-[95vw] h-[90vh] p-6 bg-[var(--tertiary)] rounded-t-3xl overflow-y-auto">

                        {/* Top Bar */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Yearly Breakdown</h2>

                            <div className="flex gap-3 items-center">

                                {/* Year Dropdown */}
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="px-2 py-1 rounded bg-white/10"
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>

                                {/* Close Button */}
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-3 py-1 bg-red-500 rounded-lg hover:bg-red-600"
                                >
                                    ✕
                                </button>

                            </div>
                        </div>

                        {/* Charts Grid */}
                        <div className="flex flex-wrap gap-5">
                            {monthsArray.map(([key, monthData]) => (
                                <div className="relative h-[200px] min-w-[800px] flex-1 bg-white/5 p-2 rounded-xl">

                                    <p className="text-sm mb-1">
                                        {new Date(monthData[0].date).toLocaleString("default", { month: "long" })}
                                    </p>

                                    <div className="h-[160px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={monthData}>
                                                <XAxis dataKey="date" hide />
                                                <YAxis hide />
                                                <Tooltip />
                                                <Bar
                                                    dataKey="hours"
                                                    fill="#ff0077"
                                                    radius={[6, 6, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                </div>                            ))}
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}
