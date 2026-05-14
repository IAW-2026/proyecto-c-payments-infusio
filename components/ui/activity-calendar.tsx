"use client";

interface ActivityCalendarProps {
  data: { date: string; count: number }[];
}

export function ActivityCalendar({ data }: ActivityCalendarProps) {
  // Simple representation of the last 90 days or similar
  // For now, let's just render the squares based on the provided data
  
  return (
    <section 
      className="bg-card p-6 rounded-3xl border border-tan shadow-sm"
      aria-label="Frecuencia de Compra"
    >
      <h3 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium mb-6" aria-hidden="true">
        Frecuencia de Compra
      </h3>
      
      {/* Screen reader only data */}
      <div className="sr-only">
        <p>Historial de compras recientes:</p>
        <ul>
          {data.map((day, i) => (
            <li key={i}>{day.date}: {day.count} compras</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2" aria-hidden="true">
        {data.map((day, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-sm transition-colors ${
              day.count === 0
                ? "bg-muted"
                : day.count === 1
                ? "bg-olive/30"
                : day.count === 2
                ? "bg-olive/60"
                : "bg-olive"
            }`}
            title={`${day.date}: ${day.count} compras`}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-[10px] text-muted-foreground italic" aria-hidden="true">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-muted rounded-sm" />
          <span>Menos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-olive rounded-sm" />
          <span>Más</span>
        </div>
      </div>
    </section>
  );
}
