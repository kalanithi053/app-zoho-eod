"use client";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const VALUES = [7, 10, 5, 13, 12, 3, 0];
const MAX = Math.max(...VALUES);

export function WeeklyChart() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-zinc-200">Jobs this week</p>
          <p className="text-xs text-zinc-500 mt-0.5">Total runs per day</p>
        </div>
        <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-1 rounded-md">
          50 total
        </span>
      </div>

      <div className="flex items-end gap-2 h-32">
        {DAYS.map((day, i) => {
          const pct = VALUES[i] / MAX;
          const today = i === new Date().getDay() - 1;
          return (
            <div
              key={day}
              className="flex-1 flex flex-col items-center gap-1.5"
            >
              <span className="text-[10px] text-zinc-500">
                {VALUES[i] || ""}
              </span>
              <div className="w-full flex items-end" style={{ height: "80px" }}>
                <div
                  className={`w-full rounded-t-sm transition-all ${
                    today
                      ? "bg-brand-400"
                      : VALUES[i]
                        ? "bg-zinc-700"
                        : "bg-zinc-800"
                  }`}
                  style={{
                    height: `${Math.max(pct * 100, VALUES[i] ? 4 : 0)}%`,
                  }}
                />
              </div>
              <span
                className={`text-[10px] ${today ? "text-brand-400 font-medium" : "text-zinc-600"}`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
