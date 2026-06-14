"use client";

import clsx from "clsx";
import {
  Bell,
  ChevronRight,
  Clock,
  Folders,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
];

const SETTINGS_SUB = [
  { href: "/settings?tab=oauth", label: "OAuth", icon: User },
  { href: "/settings?tab=sheet", label: "Sheet config", icon: Folders },
  { href: "/settings?tab=projects", label: "Projects", icon: Folders },
  { href: "/settings?tab=profile", label: "Profile", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  return (
    <aside className="w-[220px] flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-zinc-800">
        <div className="w-8 h-8 rounded-lg bg-brand-400 flex items-center justify-center flex-shrink-0">
          <Clock className="w-4 h-4 text-brand-900" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-100 leading-none">
            EOD Reporter
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Automated daily logging
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-2 text-[10px] font-medium text-zinc-600 uppercase tracking-wider mb-2">
          Main
        </p>

        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 group",
                active
                  ? "bg-brand-400/10 text-brand-400 font-medium"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 opacity-60" />}
            </Link>
          );
        })}

        {/* Settings sub-nav */}
        {pathname.startsWith("/settings") && (
          <div className="mt-1 ml-4 space-y-0.5 border-l border-zinc-800 pl-3">
            {SETTINGS_SUB.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Status section */}
        <div className="pt-4">
          <p className="px-2 text-[10px] font-medium text-zinc-600 uppercase tracking-wider mb-2">
            System
          </p>
          <div className="px-3 py-2 rounded-lg bg-zinc-800/50 space-y-2">
            <StatusRow label="Job queue" status="healthy" />
            <StatusRow label="Zoho sync" status="healthy" />
            <StatusRow label="EOD mailer" status="idle" />
          </div>
        </div>
      </nav>

      {/* User footer */}
      <div className="border-t border-zinc-800 px-3 py-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-zinc-800 transition-colors group">
          <div className="w-7 h-7 rounded-full bg-brand-800 flex items-center justify-center text-[10px] font-semibold text-brand-100 flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">
              {session?.user?.name ?? "User"}
            </p>
            <p className="text-[10px] text-zinc-500 truncate">
              {session?.user?.email ?? ""}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-400 text-zinc-500"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function StatusRow({
  label,
  status,
}: {
  label: string;
  status: "healthy" | "idle" | "error";
}) {
  const colors = {
    healthy: "bg-brand-400",
    idle: "bg-zinc-500",
    error: "bg-red-500",
  };
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-zinc-500">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className={clsx("w-1.5 h-1.5 rounded-full", colors[status])} />
        <span className="text-[10px] text-zinc-600 capitalize">{status}</span>
      </div>
    </div>
  );
}
