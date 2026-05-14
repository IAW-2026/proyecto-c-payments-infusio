import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <article 
      className="bg-card p-6 rounded-3xl border border-tan shadow-sm hover:shadow-md transition-shadow"
      aria-label={`Estadística: ${label}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
          {label}
        </h3>
        {Icon && <Icon className="w-5 h-5 text-olive opacity-60" aria-hidden="true" />}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-serif text-brown">{value}</span>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1.5" aria-label={`Tendencia: ${trend.isPositive ? 'Subió' : 'Bajó'} un ${Math.abs(trend.value)}% ${trend.label}`}>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              trend.isPositive
                ? "bg-olive/10 text-olive"
                : "bg-terracotta/10 text-terracotta"
            }`}
            aria-hidden="true"
          >
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </span>
          <span className="text-[10px] text-muted-foreground italic" aria-hidden="true">
            {trend.label}
          </span>
        </div>
      )}
    </article>
  );
}
