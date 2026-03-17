import { useEffect, useState } from "react"

type DayType = "" | "good-day" | "mid-day" | "bad-day"

type DayData = {
    [key: number]: DayType
}

export default function MoodHeatmap() {

    const [moodData, setMoodData] = useState<DayData>({})
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })

    const date = new Date()
    const today = date.getDate()
    const firstDay =
        (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7

    function totalDays() {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    function storeData(d: DayData) {
        localStorage.setItem("day_moodData", JSON.stringify(d))
    }

    function retrieveData(): DayData | null {
        const d = localStorage.getItem("day_moodData")
        return d ? JSON.parse(d) : null
    }

    function initData() {
        let stored = retrieveData()

        if (!stored) {
            const fresh: DayData = {}

            for (let i = 1; i <= totalDays(); i++) {
                fresh[i] = ""
            }

            storeData(fresh)
            stored = fresh
        }

        setMoodData(stored)
    }

    function updateDay(day: number, type: DayType) {
        const newData = { ...moodData }
        newData[day] = type

        setMoodData(newData)
        storeData(newData)
    }

    useEffect(() => {
        initData()
    }, [])

    useEffect(() => {
        function closeMenu() {
            setShowModal(false)
        }

        if (showModal) {
            document.addEventListener("click", closeMenu)
        }

        return () => {
            document.removeEventListener("click", closeMenu)
        }
    }, [showModal])

    const cells = []

    // empty padding before month start
    for (let i = 0; i < firstDay; i++) {
        cells.push(
            <div key={"empty-" + i} className="day-cell disabled-day"></div>
        )
    }

    // actual days
    for (let i = 1; i <= totalDays(); i++) {

        let className = "day-cell "
        let type: DayType = ""

        moodData[i]   // existing localStorage mood

        if (type) className += type
            else className += "vacant-day"
        if (i === today && !type) className += " today"

        if (i > today) className += " action-not-allowed"

        cells.push(
            <div
                key={i}
                className={className}
                onClick={(e) => {
                    e.stopPropagation()
                    if (i > today) return

                    setSelectedDay(i)
                    setMenuPos({
                        x: e.clientX,
                        y: e.clientY
                    })
                    setShowModal(true)
                }}>
                {i === today && !type ? "?" : ""}
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-7 gap-2 [&_span]:text-center">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                {cells}
            </div>

            {showModal && (
                <ul
                    onClick={(e) => e.stopPropagation()}
                    className="fixed z-50 bg-zinc-800 text-white 
                    rounded-xl p-3 shadow-xl w-44 animate-in fade-in zoom-in-95"
                    style={{
                        top: menuPos.y,
                        left: menuPos.x
                    }}
                >

                    <h5 className="font-bold mb-2 text-sm">How Was Your Day</h5>

                    <li
                        className="list-none bg-green-500 hover:bg-green-600 rounded-lg px-3 py-2 cursor-pointer"
                        onClick={() => {
                            if (selectedDay) updateDay(selectedDay, "good-day")
                            setShowModal(false)
                        }}
                    >
                        <p className="pointer-events-none">Good Day</p>
                    </li>

                    <li
                        className="list-none bg-yellow-500 hover:bg-yellow-600 rounded-lg px-3 py-2 cursor-pointer my-2"
                        onClick={() => {
                            if (selectedDay) updateDay(selectedDay, "mid-day")
                            setShowModal(false)
                        }}
                    >
                        <p className="pointer-events-none">Mid Day</p>
                    </li>

                    <li
                        className="list-none bg-red-500 hover:bg-red-600 rounded-lg px-3 py-2 cursor-pointer"
                        onClick={() => {
                            if (selectedDay) updateDay(selectedDay, "bad-day")
                            setShowModal(false)
                        }}
                    >
                        <p className="pointer-events-none">Bad Day</p>
                    </li>

                </ul>
            )}
        </>
    )
}

