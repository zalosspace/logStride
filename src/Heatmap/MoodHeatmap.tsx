import { useEffect, useState, useMemo } from "react"
import { supabase } from "../Supabase"

type DayType = "" | "good-day" | "mid-day" | "bad-day"

type DayData = {
    [key: number]: DayType
}

type Day = {
    date: string;
    hours: number;
    mood: number;
};

export default function MoodHeatmap({ data = [] }: { data: Day[] }) {

    const [localData, setLocalData] = useState<Day[]>(data);
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })

    const moodMap = useMemo(() => {
        const map = new Map<string, DayType>();

        localData.forEach(d => {
            let type: DayType = "";

            if (d.mood === 2) type = "good-day";
                else if (d.mood === 1) type = "mid-day";
                    else if (d.mood === 0) type = "bad-day";

            map.set(d.date, type);
        });

        return map;
    }, [localData]);

    const date = localData.length > 0 ? new Date(data[0].date) : new Date()

    const now = new Date();
    const isCurrentMonth =
        now.getFullYear() === date.getFullYear() &&
            now.getMonth() === date.getMonth();

    const today = isCurrentMonth ? now.getDate() : 31; 

    const firstDay =
        (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7

    function totalDays() {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    async function updateDay(day: number, type: DayType) {
        let mood = 1

        if (type === "good-day") mood = 2
        if (type === "mid-day") mood = 1
        if (type === "bad-day") mood = 0

        const fullDate = new Date(date.getFullYear(), date.getMonth(), day)
        .toLocaleDateString("en-CA")

        // Local UI Refresh
        setLocalData(prev => {
            const newEntry: Day = {
                date: fullDate,
                mood,
                hours: prev.find(d => d.date === fullDate)?.hours ?? 0
            };

            return [
                ...prev.filter(d => d.date !== fullDate),
                newEntry
            ];
        }); 
            
        const {
            data: { user }
        } = await supabase.auth.getUser()

        const { error } = await supabase
            .from("days")
            .upsert({
                user_id: user?.id,
                date: fullDate,
                mood: mood,
                hours: 0 // default
            },
                {
                    onConflict: "user_id,date"
                }
            )

        if (error) {
            console.error(error)
            return
        }

    }

    // Update Local Data
    useEffect(() => {
        setLocalData(data);
    }, [data]);

    // Modal
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
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

        let type: DayType = moodMap.get(key) || "";

        let className = "day-cell ";

        if (type) className += type;
            else className += "vacant-day";

        if (i === today && !type) className += " today";
        if (i > today) className += " action-not-allowed";

        cells.push(
            <div
                key={i}
                className={className}
                onClick={(e) => {
                    e.stopPropagation();
                    if (i > today) return;

                    setSelectedDay(i);
                    setMenuPos({ x: e.clientX, y: e.clientY });
                    setShowModal(true);
                }}
            >
                {i === today && !type ? "?" : ""}
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-7 gap-2 w-fit text-sm [&_span]:text-center">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                {cells}
            </div>

            {showModal && (
                <ul
                    onClick={(e) => e.stopPropagation()}
                    className="fixed bg-zinc-800 text-white 
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

