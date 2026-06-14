import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ActivityLog } from "@/components/ui/ActivityLog";
import { MetricCard } from "@/components/ui/MetricCard";
import { UpcomingJobs } from "@/components/ui/UpcommingJobs";
import { WeeklyChart } from "@/components/ui/WeeklyTask";
import { Mail, RefreshCw, Timer, TrendingUp } from "lucide-react";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-100">
          Good {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {dateStr} · {timeStr} IST
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard
          label="Jobs run today"
          value="12"
          delta="+3 vs yesterday"
          trend="up"
          icon={<Timer className="w-4 h-4" />}
        />
        <MetricCard
          label="EOD mails sent"
          value="8"
          delta="On track"
          trend="neutral"
          icon={<Mail className="w-4 h-4" />}
        />
        <MetricCard
          label="Tasks synced"
          value="34"
          delta="5 failed"
          trend="down"
          icon={<RefreshCw className="w-4 h-4" />}
        />
        <MetricCard
          label="Active crons"
          value="3"
          delta="2 projects"
          trend="neutral"
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <WeeklyChart />
        <UpcomingJobs />
      </div>

      {/* Activity log */}
      <ActivityLog />
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
