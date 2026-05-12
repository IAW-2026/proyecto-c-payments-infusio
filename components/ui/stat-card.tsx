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
    <div className="bg-card p-6 rounded-3xl border border-tan shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
          {label}
        </span>
        {Icon && <Icon className="w-5 h-5 text-olive opacity-60" />}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-serif text-brown">{value}</span>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1.5">
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              trend.isPositive
                ? "bg-olive/10 text-olive"
                : "bg-terracotta/10 text-terracotta"
            }`}
          >
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </span>
          <span className="text-[10px] text-muted-foreground italic">
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
