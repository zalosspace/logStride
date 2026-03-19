type Day = {
    date: string;
    hours: number;
    mood: number;
};

export default function WorkHourHeatmap({ data = [] }: { data: Day[] }) {

    // const dayMap = new Map<string, Day>();
    // data.forEach((d) => {
    //     const dt = new Date(d.date);
    //     const key =
    //         dt.getFullYear() + "-" +
    //             String(dt.getMonth() + 1).padStart(2, "0") + "-" +
    //             String(dt.getDate()).padStart(2, "0");
    //
    //     dayMap.set(key, d);
    // });

    const date = new Date()
    const firstDay =
        (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7
    const cells = []

    // empty padding before month start
    for (let i = 0; i < firstDay; i++) {
        cells.push(
            <div key={"empty-" + i} className="day-cell disabled-day"></div>
        )
    }

    // actual days
    data.forEach((day, idx) => {
        const hours = day?.hours ?? 0;

        const intensity = Math.min(hours / 8, 1);

        cells.push(
            <div
                key={idx}
                className="day-cell aspect-square rounded-sm"
                style={{
                    backgroundColor: `hsl(330, 100%, ${40 + (1-intensity) * 50}%)`
                }}
                title={`${day.date}: ${hours}h`}
            />
        )
    })

    return (
            <div className="grid grid-cols-7 gap-2 [&_span]:text-center">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                {cells}
            </div>
    );
}
