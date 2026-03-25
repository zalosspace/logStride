import { useEffect, useState, useMemo } from "react"
import { createClient } from "@supabase/supabase-js"
import { fetchAllDays } from "./Supabase"
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
    const [yearlyData, setYearlyData] = useState<Day[]>([])

    // Years
    const years = useMemo(() => {
        return Array.from(
            new Set(yearlyData.map(d => new Date(d.date).getFullYear()))
        ).sort((a, b) => b - a)
    }, [yearlyData])

    const [selectedYear, setSelectedYear] = useState(years[0])

    const filteredData = yearlyData.filter(
        d => new Date(d.date).getFullYear() === selectedYear
    )

    function groupByMonth(data: Day[]) {
        const months: { [key: number]: Day[] } = {}

        data.forEach((item) => {
            const month = new Date(item.date).getMonth()

            if (!months[month]) months[month] = []
            months[month].push(item)
        })

        return months
    }

    const monthlyData = groupByMonth(filteredData)

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ]

    useEffect(() => {
        fetchAllDays().then(setYearlyData)
    }, [showModal])

    useEffect(() => {
        if (years.length > 0) {
            setSelectedYear(years[0])
        }
    }, [years])

    return (
        <>
            <div className="w-full flex items-center justify-between px-2 mb-8">

                <h2 className="text-lg font-semibold text-zinc-200">
                    Work Hours
                </h2>

                <div className="flex items-center gap-2">

                    <select
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 text-sm text-zinc-300 
                        border border-zinc-700 focus:outline-none"
                        onChange={(e) => fetchHours(Number(e.target.value))}
                    >
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => setShowModal(!showModal)}
                        className="btn px-3 py-1.5"
                    >
                        Expand
                    </button>

                </div>
            </div>
            <div className="w-full h-[300px] z-0">
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

                <ResponsiveContainer className="max-h-[90%] translate-x-[-2%]">
                    <BarChart data={data}>
                        <XAxis 
                            dataKey="date" 
                            tick={{ fill: "#888" }} 
                        />

                        <YAxis 
                            tick={{ fill: "#888" }} 
                        />
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
                        <div className="flex flex-wrap gap-4">

                            {Array.from({ length: 12 }).map((_, monthIndex) => {
                                const monthData = monthlyData[monthIndex] || []

                                if (!monthData.length) return null

                                return (
                                    <div
                                        key={monthIndex}
                                        className="bg-white/5 p-4 rounded-xl min-w-[300px] flex-1"
                                    >

                                        <p className="text-sm font-bold mb-2">
                                            {monthNames[monthIndex]}
                                        </p>

                                        <div className="h-[180px]">
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

                                    </div>
                                )
                            })}

                        </div>

                    </div>
                </div>
            )}
        </>
    )
}
