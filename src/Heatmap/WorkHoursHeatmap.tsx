type Day = {
  date: string;
  hours: number;
  mood: number;
};

export default function Heatmap({ data = [] }: { data: Day[] }) {

  const dayMap = new Map<string, Day>();
  data.forEach((d) => {
    const dt = new Date(d.date);
    const key =
      dt.getFullYear() + "-" +
      String(dt.getMonth() + 1).padStart(2, "0") + "-" +
      String(dt.getDate()).padStart(2, "0");

    dayMap.set(key, d);
  });

  const cells = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dateStr =
      date.getFullYear() + "-" +
      String(date.getMonth() + 1).padStart(2, "0") + "-" +
      String(date.getDate()).padStart(2, "0");


    const day = dayMap.get(dateStr);
    const hours = day?.hours ?? 0;
        console.log(dateStr)
        console.log(hours)

    const intensity = Math.min(hours / 8, 1);

    cells.push(
      <div
        key={dateStr}
        className="day-cell aspect-square rounded-sm"
        style={{
          backgroundColor: `hsl(330, 100%, ${20 + intensity * 50}%)`
        }}
        title={`${dateStr}: ${hours}h`}
      />
    );
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {cells}
    </div>
  );
}
