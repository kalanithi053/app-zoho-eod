import clsx from "clsx";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

export function MetricCard({
  label,
  value,
  delta,
  trend,
  icon,
}: MetricCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
          {label}
        </span>
        <span className="text-zinc-600">{icon}</span>
      </div>
      <p className="text-2xl font-semibold text-zinc-100 mb-1">{value}</p>
      <div
        className={clsx(
          "flex items-center gap-1 text-xs",
          trend === "up" && "text-brand-400",
          trend === "down" && "text-red-400",
          trend === "neutral" && "text-zinc-500",
        )}
      >
        {trend === "up" && <TrendingUp className="w-3 h-3" />}
        {trend === "down" && <TrendingDown className="w-3 h-3" />}
        {trend === "neutral" && <Minus className="w-3 h-3" />}
        {delta}
      </div>
    </div>
  );
}
