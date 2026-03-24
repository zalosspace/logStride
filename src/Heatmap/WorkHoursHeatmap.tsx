type Day = {
    date: string;
    hours: number;
    mood: number;
};

export default function WorkHourHeatmap({ data = [] }: { data: Day[] }) {

    const dayMap = new Map<string, Day>();
    data.forEach((d) => {
        dayMap.set(d.date, d);
    });


    const date = data.length > 0 ? new Date(data[0].date) : new Date()
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay =
        (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7
    const cells = []

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // empty padding before month start
    for (let i = 0; i < firstDay; i++) {
        cells.push(
            <div key={"empty-" + i} className="day-cell disabled-day"></div>
        )
    }

    // actual days
for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    
    const day = dayMap.get(key);
    const hours = day?.hours ?? 0;
    const intensity = Math.min(hours / 8, 1);

    cells.push(
        <div
            key={key}
            className="day-cell aspect-square rounded-sm"
            style={{
                backgroundColor: day
                    ? `hsl(330, 100%, ${40 + (1 - intensity) * 50}%)`
                    : "var(--tertiary)" 
            }}
            title={day ? `${key}: ${hours}h` : `${key}: no data`}
        />
    );
}
    return (
        <div className="grid grid-cols-7 gap-2 w-fit text-sm [&_span]:text-center">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            {cells}
        </div>
    );
}
