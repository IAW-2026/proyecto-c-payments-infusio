import { StatCard } from "@/components/ui/stat-card";
import { type LucideIcon } from "lucide-react";

export interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
}

interface StatGridProps {
  stats: StatItem[];
}

export function StatGrid({ stats }: StatGridProps) {
  // Determine grid columns based on the number of stats to make it look balanced
  const gridCols =
    stats.length === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : stats.length === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2";

  return (
    <div className={`grid gap-6 ${gridCols} mb-12`}>
      {stats.map((stat, index) => (
        <StatCard
          key={`${stat.label}-${index}`}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  );
}
