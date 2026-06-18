"use client";
import { OAuthTab } from "@/components/settings/OauthTab";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { ProjectsTab } from "@/components/settings/ProjectsTab";
import { SheetTab } from "@/components/settings/SheetTab";
import { useUserStore } from "@/store/useAuthStore";
import clsx from "clsx";
import { Folders, KeyRound, Table2, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  { id: "oauth", label: "OAuth", icon: KeyRound },
  { id: "sheet", label: "Sheet config", icon: Table2 },
  { id: "projects", label: "Projects", icon: Folders },
  { id: "profile", label: "Profile", icon: User },
];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") ?? "oauth";
const {user}=useUserStore()
  const setTab = (tab: string) => {
    router.push(`/settings?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-100">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage OAuth connections, sheet config, and project mappings
        </p>
      </div>

      <div className="flex gap-5">
        {/* Tab sidebar */}
        <div className="w-44 flex-shrink-0">
          <nav className="bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 space-y-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                disabled={id=== "sheet" && user?.configuration?.cronOption === "EOD"}
                className={clsx(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-all duration-150",
                  activeTab === id
                    ? "bg-brand-400/10 text-brand-400 font-medium"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
                )}
              >
                {
                  // TODO Diable style
                }
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {activeTab === "oauth" && <OAuthTab />}
          {activeTab === "sheet" && <SheetTab />}
          {activeTab === "projects" && <ProjectsTab />}
          {activeTab === "profile" && <ProfileTab />}
        </div>
      </div>
    </div>
  );
}
