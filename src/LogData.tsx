import { useState } from "react"
import { supabase } from "./Supabase"

export default function LogData({ onClose }: {onClose: () => void}) {
    const today = new Date().toISOString().split("T")[0]

    const [date, setDate] = useState(today)
    const [hours, setHours] = useState<number | "">("")
    const [mood, setMood] = useState(5)
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState("")

    async function saveDay() {
        if (hours === "") {
            setMsg("Enter work hours.")
            return
        }

        setLoading(true)
        setMsg("") 

        const { data: { user } } = await supabase.auth.getUser()

        const { error } = await supabase
            .from("days")
            .upsert({
                user_id: user?.id,
                date,
                hours: hours,
                mood,
            }, { onConflict: "user_id,date" })

        if (error) {
            setMsg(error.message)
        } else {
            setMsg("Day logged successfully")

            setTimeout(() => {
                onClose()
            }, 500)
        }

        setLoading(false)
    }

    return (
        <div className="relative max-w-md mx-auto mt-10 p-6 rounded-2xl 
            bg-zinc-900/80 backdrop-blur shadow-xl border border-white/10 space-y-5">
            <button
                onClick={onClose}
                className="px-3 py-1 bg-red-500 rounded-lg hover:bg-red-600"
            >
                ✕
            </button>


            <h2 className="text-2xl font-semibold text-white tracking-tight">
                Log Your Day
            </h2>

            {/* Date */}
            <div className="space-y-1">
                <label className="text-sm text-zinc-400">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
            </div>

            {/* Work Hours */}
            <div className="space-y-1">
                <label className="text-sm text-zinc-400">Work Hours</label>
                <input
                    type="number"
                    step="0.1"
                    value={hours}
                    onChange={e => setHours(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
            </div>

            {/* Mood */}
            <div className="space-y-2">
                <label className="text-base text-zinc-400 flex justify-between">
                    Mood
                    <span className="text-zinc-300">
                        {mood === 0 && "😞 Bad"}
                        {mood === 1 && "😐 Mid"}
                        {mood === 2 && "🔥 Good"}
                    </span>
                </label>

                <div className="flex rounded-lg overflow-hidden border border-white/10">
                    {[
                        { label: "Bad", value: 0},
                        { label: "Mid", value: 1},
                        { label: "Good", value: 2}
                    ].map((m) => (
                            <button
                                key={m.value}
                                onClick={() => setMood(m.value as 0 | 1 | 2)}
                                className={`flex-1 py-2 text-sm transition-all duration-200
${mood === m.value
? "bg-white text-black"
: "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
}`}>
                                {m.label}
                            </button>

                        ))}
                </div>
            </div>
            
            {/* Button */}
            <button
                onClick={saveDay}
                disabled={loading}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save Day"}
            </button>

            {/* Message */}
            {msg && (
                <p className="text-sm text-center text-zinc-400">
                    {msg}
                </p>
            )}

        </div>
    )
}
