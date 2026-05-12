"use client";

import { Trophy, TrendingUp } from "lucide-react";

interface RankingItem {
  label: string;
  value: number;
  orders?: number;
}

interface RankingListProps {
  title: string;
  data: RankingItem[];
}

export function RankingList({ title, data }: RankingListProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-card p-6 rounded-3xl border border-tan shadow-sm flex flex-col h-full">
      <h3 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium mb-8">
        {title}
      </h3>

      <div className="space-y-6 flex-1">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground italic text-center py-12">
            No hay datos suficientes aún.
          </p>
        ) : (
          data.map((item, i) => {
            const percentage = (item.value / maxValue) * 100;
            const isTop = i === 0;

            return (
              <div key={item.label} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isTop ? "bg-terracotta text-cream shadow-lg shadow-terracotta/20" : "bg-tan/30 text-brown"
                    }`}>
                      {i + 1}
                    </div>
                    <span className="text-sm font-mono text-brown group-hover:text-terracotta transition-colors truncate max-w-[150px]" title={item.label}>
                      {item.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-brown">
                      ${item.value.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-tan/20 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${
                      isTop ? "bg-terracotta" : "bg-olive/60"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {data.length > 0 && (
        <div className="mt-8 pt-6 border-t border-tan/20 flex items-center gap-2 text-[10px] text-terracotta font-bold uppercase tracking-wider">
          <Trophy className="w-3 h-3" />
          <span>Líder de la red: {data[0].label}</span>
        </div>
      )}
    </div>
  );
}
