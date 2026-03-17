import { useEffect, useState } from "react"
import "../globals.css"
import MoodHeatmap from "./MoodHeatmap"
import WorkHoursHeatmap from "./WorkHoursHeatmap"

type DayType = "" | "good-day" | "mid-day" | "bad-day"

type DayData = {
    [key: number]: DayType
}

export default function Heatmap({ data=[] }: { data: Day[] }) {
    const [tab, setTab] = useState<"mood" | "hours">("hours")

    return (
        <>
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

            {tab === "mood" ? <MoodHeatmap /> : <WorkHoursHeatmap data={data} />}
        </>
    )
}
