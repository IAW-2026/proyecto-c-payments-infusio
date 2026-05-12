interface BarChartProps {
  label: string;
  data: { label: string; value: number }[];
  color?: "primary" | "accent";
}

export function BarChart({ label, data, color = "primary" }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-card p-6 rounded-3xl border border-tan shadow-sm">
      <h3 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium mb-8">
        {label}
      </h3>
      <div className="flex items-end justify-center gap-8 h-48">
        {data.map((item, i) => (
          <div key={i} className="flex-1 max-w-[80px] h-full flex flex-col items-center gap-3 group">
            <div className="relative w-full flex-1 flex items-end justify-center">
              {/* Tooltip */}
              <div className="absolute -top-10 bg-brown text-cream text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                ${item.value.toLocaleString()}
              </div>
              {/* Bar Container (Full height) */}
              <div className="w-full bg-muted/20 rounded-t-lg h-full relative flex items-end justify-center overflow-hidden">
                {/* Real Bar */}
                <div
                  className={`w-full transition-all duration-700 ease-out ${
                    color === "primary" ? "bg-primary" : "bg-accent"
                  }`}
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold truncate w-full text-center px-1" title={item.label}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
