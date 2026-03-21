import { useEffect, useState } from "react"
import MoodHeatmap from "./MoodHeatmap"
import WorkHoursHeatmap from "./WorkHoursHeatmap"

type Day = {
    date: string
    hours: number
    mood: number
}

export default function Heatmap({ data = [] }: { data: Day[] }) {
    const [tab, setTab] = useState<"mood" | "hours">("hours")
    const [showModal, setShowModal] = useState(false)

    const years = Array.from(
        new Set(data.map(d => new Date(d.date).getFullYear()))
    ).sort((a, b) => b - a)

    const [selectedYear, setSelectedYear] = useState<number | null>(null)

    useEffect(() => {
        if (years.length > 0) {
            setSelectedYear(years[0])
        }
    }, [data])

    // Filter by year
    const filteredData = selectedYear
        ? data.filter(d => new Date(d.date).getFullYear() === selectedYear)
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
            {/* Tabs */}
            <div className="flex gap-2 mb-3">
                <button
                    onClick={() => setTab("mood")}
                    className={`px-3 py-1 rounded-lg ${tab === "mood" ? "bg-zinc-700 text-white" : "bg-zinc-200"}`}
                >
                    Mood
                </button>
                <button
                    onClick={() => setTab("hours")}
                    className={`px-3 py-1 rounded-lg ${tab === "hours" ? "bg-zinc-700 text-white" : "bg-zinc-200"}`}
                >
                    Work Hours
                </button>
            </div>

            {/* Preview */}
            {tab === "mood"
                ? <MoodHeatmap data={data} />
                : <WorkHoursHeatmap data={data} />
            }

            {/* Open Modal */}
            <button
                onClick={() => setShowModal(true)}
                className="mt-3 px-3 py-1 bg-blue-500 rounded-lg"
            >
                Expand
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-end">

                    <div className="w-[95vw] h-[90vh] p-6 bg-[var(--tertiary)] rounded-t-3xl overflow-y-auto">

                        {/* Top Bar */}
                        <div className="flex justify-between items-center mb-4">
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
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Array.from({ length: 12 }).map((_, monthIndex) => {
                                const monthData = monthlyData[monthIndex] || []

                                return (
                                    <div
                                        key={monthIndex}
                                        className="bg-white/5 p-3 rounded-xl"
                                    >
                                        <p className="text-sm mb-2">
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
