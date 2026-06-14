import clsx from "clsx";

type LogStatus = "success" | "warning" | "error" | "info";

const LOGS: { title: string; meta: string; status: LogStatus }[] = [
  {
    title: "EOD mail sent — Alpha project",
    meta: "Mode 2 · 3 tasks synced · 5:58 PM",
    status: "success",
  },
  {
    title: "Zoho sync complete — 11 tasks upserted",
    meta: "Sheet reader → Zoho sync · 5:57 PM",
    status: "success",
  },
  {
    title: "Sheet reader — 2 rows skipped (missing hours)",
    meta: "Mode 4 · Alpha project · 2:00 PM",
    status: "warning",
  },
  {
    title: "Zoho API timeout — task log failed",
    meta: "Mode 3 · Beta project · 11:30 AM",
    status: "error",
  },
  {
    title: "Job scheduled — Gamma project EOD",
    meta: "Mode 5 · Cron registered · 9:00 AM",
    status: "info",
  },
];

const DOT_COLORS: Record<LogStatus, string> = {
  success: "bg-brand-400",
  warning: "bg-amber-400",
  error: "bg-red-500",
  info: "bg-blue-400",
};

const BADGE_STYLES: Record<LogStatus, string> = {
  success: "bg-brand-400/10 text-brand-400",
  warning: "bg-amber-400/10 text-amber-400",
  error: "bg-red-500/10 text-red-400",
  info: "bg-blue-400/10 text-blue-400",
};

const BADGE_LABELS: Record<LogStatus, string> = {
  success: "Success",
  warning: "Warning",
  error: "Error",
  info: "Info",
};

export function ActivityLog() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-zinc-200">Activity log</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            Recent job runs and events
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-brand-400">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Live
        </span>
      </div>

      <div className="space-y-0">
        {LOGS.map((log, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3 border-b border-zinc-800 last:border-0"
          >
            <div
              className={clsx(
                "w-2 h-2 rounded-full flex-shrink-0",
                DOT_COLORS[log.status],
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-200 truncate">{log.title}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{log.meta}</p>
            </div>
            <span
              className={clsx(
                "text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0",
                BADGE_STYLES[log.status],
              )}
            >
              {BADGE_LABELS[log.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
