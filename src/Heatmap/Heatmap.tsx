import { useEffect, useState, useMemo } from "react"
import MoodHeatmap from "./MoodHeatmap"
import WorkHoursHeatmap from "./WorkHoursHeatmap"

import type { Day } from "../Types"
import { fetchAllDays, fetchThisMonth } from "../Supabase"

export default function Heatmap({ user }: {user: any}) {
    const [tab, setTab] = useState<"mood" | "hours">("hours")
    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState<Day[]>([])
    const [yearlyData, setYearlyData] = useState<Day[]>([])
    const [selectedYear, setSelectedYear] = useState<number | null>(null)

    const years = useMemo(() => {
        return Array.from(
            new Set(yearlyData.map(d => new Date(d.date).getFullYear()))
        ).sort((a, b) => b - a)
    }, [yearlyData])

    useEffect(() => {
        if (years.length > 0) {
            setSelectedYear(years[0])
        }
    }, [years])

    useEffect(() => {
        if (user) {
            fetchThisMonth().then(data => {
                setData(data ?? [])
            })
        }
    }, [user])

    useEffect(() => {
        if (!showModal) return

        async function load() {
            const res = await fetchAllDays()
            setYearlyData(res ?? [])
        }

        load()
    }, [showModal])

    // Filter by year
    const filteredData = selectedYear
        ? yearlyData.filter(d => new Date(d.date).getFullYear() === selectedYear)
        : []

    // Group by month (0–11)
    function groupByMonth(data: Day[]) {
        const months: { [key: number]: Day[] } = {}

        data.forEach((item) => {
            const date = new Date(item.date)
            const month = date.getMonth()

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

    return (
        <>
            <div className="flex items-center justify-between w-full px-4 mb-3">

                <h2 className="text-lg font-semibold text-zinc-200">
                    Heatmap 
                </h2>
                {/* Tabs */}
                <div className="flex items-center gap-2">

                    <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg">
                        <button
                            onClick={() => setTab("mood")}
                            className={`px-3 py-1 rounded-md text-sm ${
tab === "mood"
? "bg-zinc-700 text-white"
: "text-zinc-400 hover:text-white"
}`}
                        >
                            Mood
                        </button>

                        <button
                            onClick={() => setTab("hours")}
                            className={`px-3 py-1 rounded-md text-sm ${
tab === "hours"
? "bg-zinc-700 text-white"
: "text-zinc-400 hover:text-white"
}`}
                        >
                            Work
                        </button>
                    </div>

                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn px-3 py-1.5"
                >
                    Expand
                </button>
            </div>

            {/* Preview */}
            {tab === "mood"
                ? <MoodHeatmap data={data} />
                : <WorkHoursHeatmap data={data} />
            }

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 backdrop-blur bg-black/50 flex justify-center items-end">

                    <div className="w-max-[95vw] min-w-[80vw] h-[90vh] p-6 bg-[var(--tertiary)] rounded-t-3xl overflow-y-auto">

                        {/* Top Bar */}
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-semibold">Yearly Breakdown</h2>

                            <div className="flex gap-3 items-center">

                                {/* Year Dropdown */}
                                <select
                                    value={selectedYear ?? ""}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="px-2 py-1 rounded bg-white/10"
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>

                                {/* Close */}
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-3 py-1 bg-red-500 rounded-lg"
                                >
                                    ✕
                                </button>

                            </div>
                        </div>

                        {/* 12 Month Grid */}
                        <div className="flex flex-wrap gap-4">
                            {Array.from({ length: 12 }).map((_, monthIndex) => {
                                const monthData = monthlyData[monthIndex] || []

                                if (!monthData || monthData.length === 0) return null

                                return (
                                    <div
                                        key={monthIndex}
                                        className="bg-white/5 p-8 rounded-xl"
                                    >
                                        <p className="text-sm font-bold mb-2">
                                            {monthNames[monthIndex]}
                                        </p>

                                        {tab === "hours" ? (
                                            <WorkHoursHeatmap data={monthData} />

                                        ) : (
                                                <MoodHeatmap data={monthData} />
                                            )}
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
