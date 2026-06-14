import { Clock } from "lucide-react";

const JOBS = [
  {
    name: "Daily EOD – Alpha",
    mode: "Mode 2 · Zoho sync + mail",
    time: "6:00 PM",
  },
  {
    name: "Standup log – Beta",
    mode: "Mode 3 · Log only + mail",
    time: "7:30 PM",
  },
  {
    name: "Status update – Gamma",
    mode: "Mode 5 · Status + mail",
    time: "9:00 PM",
  },
];

export function UpcomingJobs() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-zinc-200">Upcoming crons</p>
          <p className="text-xs text-zinc-500 mt-0.5">Scheduled for today</p>
        </div>
        <Clock className="w-4 h-4 text-zinc-600" />
      </div>

      <div className="space-y-1">
        {JOBS.map((job) => (
          <div
            key={job.name}
            className="flex items-center justify-between py-2.5 border-b border-zinc-800 last:border-0"
          >
            <div>
              <p className="text-sm text-zinc-200">{job.name}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{job.mode}</p>
            </div>
            <span className="text-xs font-medium text-brand-400 bg-brand-400/10 px-2 py-1 rounded-md flex-shrink-0 ml-2">
              {job.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
