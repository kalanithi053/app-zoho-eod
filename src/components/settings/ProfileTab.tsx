"use client";

import { useUserStore } from "@/store/useAuthStore";
import {
  FieldRow,
  SaveButton,
  Select,
  SettingsCard,
  TextInput,
  Toggle,
} from "../ui/SettingsCard";

export function ProfileTab() {
  const { user } = useUserStore();
  return (
    <div>
      <SettingsCard title="Your profile">
        <FieldRow label="Display name">
          <TextInput defaultValue={user?.name ?? ""} placeholder="Your name" />
        </FieldRow>
        <FieldRow label="Email" hint="Linked to your Google account">
          <span className="text-sm text-zinc-500">{user?.email ?? "—"}</span>
        </FieldRow>
        <FieldRow
          label="EOD mail recipient"
          hint="Who receives the daily summary"
        >
          <TextInput placeholder="manager@company.com" type="email" />
        </FieldRow>
        <FieldRow label="Timezone">
          <Select
            options={[
              "Asia/Kolkata (IST)",
              "UTC",
              "America/New_York (EST)",
              "America/Los_Angeles (PST)",
            ]}
            defaultValue="Asia/Kolkata (IST)"
          />
        </FieldRow>
      </SettingsCard>

      <SettingsCard title="Notifications">
        <FieldRow
          label="Job failure alerts"
          hint="Get notified when a cron job fails"
        >
          <Toggle defaultChecked />
        </FieldRow>
        <FieldRow
          label="Sync success summary"
          hint="Daily summary of all synced tasks"
        >
          <Toggle defaultChecked />
        </FieldRow>
        <FieldRow
          label="Token expiry warnings"
          hint="Alert 24h before OAuth token expires"
        >
          <Toggle defaultChecked />
        </FieldRow>
      </SettingsCard>

      <SettingsCard title="Cron config defaults">
        <FieldRow
          label="Default trigger mode"
          hint="Which mode new crons use by default"
        >
          <Select
            options={[
              "Mode 1 — EOD mail only",
              "Mode 2 — Create task + log → mail",
              "Mode 3 — Log only → mail",
              "Mode 4 — Upsert task + log → mail",
              "Mode 5 — Update status + log → mail",
            ]}
            defaultValue="Mode 2 — Create task + log → mail"
          />
        </FieldRow>
        <FieldRow
          label="Default cron schedule"
          hint="Default time for new jobs (24h format)"
        >
          <TextInput placeholder="18:00" className="w-24" />
        </FieldRow>
      </SettingsCard>

      <SaveButton />
    </div>
  );
}
