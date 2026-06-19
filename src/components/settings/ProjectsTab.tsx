"use client";

import { useUserStore } from "@/store/useAuthStore";
import {
  ActionButton,
  FieldRow,
  SaveButton,
  Select,
  SettingsCard,
} from "../ui/SettingsCard";

import templateService from "@/service/template.service";
import { Check, Folder, Inbox, RefreshCw, Search } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";

// Mock response shape — in the real app this is whatever Zoho's
// "list projects" endpoint returns. The point of the redesign is that
// this array can be 3 long or 300 long and the UI doesn't change.
interface ZohoProject {
  value: string;
  label: string;
  startDate: string;
}

interface ProjectMapping extends ZohoProject {
  enabled: boolean;
  key: string;
}

interface SavedPayload {
  portal: string | null;
  projects: { key: string; value: string }[];
}

export function ProjectsTab() {
  const [synced, setSynced] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [projects, setProjects] = useState<ProjectMapping[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [portalKey, setPortalKey] = useState<string>("");
  const [savedPayload, setSavedPayload] = useState<SavedPayload | null>(null);
  const { user, setUser } = useUserStore();

  const handleSync = async () => {
    setSyncing(true);
    setSavedPayload(null);
    try {
      const res = await templateService.getProjects();
      if (res?.success) {
        if (!user?.configuration?.projects?.length)
          try {
            const response = await templateService.getProfileDetials();

            if (response?.success) {
              setUser(response.data);
            }
          } catch (error) {
            console.error("Failed to load profile:", error);
          }
        const projects = res?.data
          ?.filter((project: any) => project.project_type === "active")
          ?.map((project: any) => {
            return {
              value: project.id,
              label: project.name,
              startDate: project?.start_date,
              key: project?.key,
            };
          });
        setProjects(projects);
        setSynced(true);
        setLastSynced(new Date());
      }
    } catch (e: any) {
      // TODO
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const toggleProject = (value: string): void => {
    setProjects((prev) =>
      prev.map((p) => (p.value === value ? { ...p, enabled: !p.enabled } : p)),
    );
  };
  const filtered = useMemo<ProjectMapping[]>(() => {
    const q = search.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.value.includes(q) ||
        p.key.toLowerCase().includes(q),
    );
  }, [projects, search]);

  const enabled = useMemo(() => projects.filter((p) => p.enabled), [projects]);

  const handleSave = async () => {
    const payload = {
      defaultProject: enabled.find((p) => p.value === portalKey)
        ? {
            id: portalKey,
            name: enabled.find((p) => p.value === portalKey)?.label,
          }
        : {
            id: enabled[0]?.value,
            name: enabled[0]?.label,
          },
      projects: enabled.map((p) => ({
        id: p.value,
        name: p.label,
      })),
    };
    try {
      if (!payload.projects?.length) throw new Error("Kindly enable projects");
      setLoading(true);
      const res = await templateService.updateZohoProjects(payload);
      if (res?.success) {
        // TODO
        setUser(res?.data);
        console.log(res);
      }
    } catch (error: any) {
      // TODO
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };
  const portalOptions = useMemo(
    () =>
      [
        {
          value: (user?.configuration?.portal?.id ?? "")?.toString(),
          label: user?.configuration?.portal?.name ?? "",
        },
      ]?.filter((d) => !!d.value),
    [user],
  );
  useEffect(() => {
    if (user?.configuration?.defaultProject?.id) {
      setPortalKey(user.configuration.defaultProject.id.toString());
    }

    if (user?.configuration?.projects?.length) {
      setSynced(true);
      setProjects(
        user.configuration.projects.map((p) => ({
          ...p,
          enabled: true,
          value: p.id.toString(),
          label: p.name,
          startDate: "",
          key: p.name,
        })),
      );
    }
  }, [user]);

  return (
    <>
      <SettingsCard title="Zoho project mappings">
        <FieldRow label="Portal" hint="Fallback when no sheet mapping is found">
          <Select
            options={portalOptions}
            value={(user?.configuration?.portal?.id ?? "")?.toString()}
          />
        </FieldRow>
        <FieldRow
          label="Default Project"
          hint="Fallback when no sheet mapping is found"
        >
          <Select
            options={enabled}
            value={portalKey}
            placeholder="Select a default project"
            onChange={setPortalKey}
          />
        </FieldRow>
        <div className="max-w-4xl mx-auto">
          {/* Sync + list */}
          <div className="overflow-hidden mb-6">
            <div className="p-4 flex items-center justify-between gap-4 border-b border-zinc-800">
              <div>
                <p className="text-sm text-zinc-200">Sync project details</p>
                <p className="text-xs text-zinc-500">
                  {lastSynced
                    ? `Last synced ${lastSynced.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} · ${projects.length} projects found`
                    : "Fetch the full project list from Zoho"}
                </p>
              </div>
              <ActionButton
                variant="primary"
                onClick={handleSync}
                children={
                  <div className="flex flex-row gap-2">
                    {" "}
                    <RefreshCw
                      size={15}
                      className={syncing ? "animate-spin" : ""}
                    />
                    {syncing
                      ? "Syncing…"
                      : synced
                        ? "Re-sync"
                        : "Sync project details"}
                  </div>
                }
              />
            </div>

            {!synced && !syncing && (
              <div className="p-10 flex flex-col items-center text-center gap-2">
                <Inbox size={28} className="text-zinc-500 mb-1" />
                <p className="text-slate-300 font-medium">
                  No projects synced yet
                </p>
                <p className="text-xs text-zinc-500 max-w-sm">
                  Run a sync to pull every project from Zoho. You&apos;ll choose
                  which ones to track in the next step.
                </p>
              </div>
            )}
            {syncing ? (
              <>
                {
                  // TODO loader
                }
              </>
            ) : null}
            {synced && (
              <>
                <div className="p-4 border-b border-zinc-800">
                  <div className="relative">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      value={search}
                      onChange={handleSearchChange}
                      placeholder="Search projects by label or ID"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="max-h-52 overflow-y-auto divide-y divide-zinc-800">
                  {filtered.length === 0 && (
                    <p className="p-6 text-sm text-zinc-500 text-center">
                      No projects match &quot;{search}&quot;
                    </p>
                  )}
                  {filtered?.map((p) => (
                    <div
                      key={p.value}
                      className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${
                        p.enabled ? "bg-emerald-500/5" : ""
                      }`}
                    >
                      <button
                        onClick={() => toggleProject(p.value)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          p.enabled
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-slate-600 hover:border-slate-500"
                        }`}
                        aria-label={`${p.enabled ? "Disable" : "Enable"} ${p.label}`}
                      >
                        {p.enabled && (
                          <Check size={13} className="text-slate-950" />
                        )}
                      </button>

                      <Folder size={16} className="text-zinc-500 shrink-0" />

                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => toggleProject(p.value)}
                      >
                        <p className="text-sm text-zinc-200 truncate">
                          {p.label}
                        </p>
                        <div className="flex flex-row justify-between">
                          {" "}
                          <p className="text-xs text-zinc-500 font-mono">
                            Zoho ID {p.value}{" "}
                            {p.startDate ? `| ${p.startDate}` : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                  <p>
                    {enabled.length} of {projects.length} projects enabled
                  </p>
                  <p>Only enabled projects are saved</p>
                </div>
              </>
            )}
          </div>

          {savedPayload && (
            <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-5 mb-6">
              <p className="text-sm font-medium text-emerald-400 mb-2">
                Saved — payload sent to backend
              </p>
              <pre className="text-xs text-slate-400 bg-slate-950 border border-zinc-800 rounded-lg p-3 overflow-x-auto">
                {JSON.stringify(savedPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </SettingsCard>
      <SaveButton onClick={() => handleSave()} loading={loading} />
    </>
  );
}
