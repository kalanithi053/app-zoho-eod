"use client";

import { useSession } from "next-auth/react";
import {
  ActionButton,
  FieldRow,
  Select,
  SettingsCard,
  StatusPill,
  Toggle,
} from "../ui/SettingsCard";

export function OAuthTab() {
  const { data: session } = useSession();

  return (
    <div>
      <SettingsCard title="Google OAuth">
        <FieldRow
          label="Google account"
          hint={session?.user?.email ?? "Not signed in"}
        >
          <StatusPill connected={!!session} />
          <ActionButton variant="danger">Revoke</ActionButton>
        </FieldRow>
        <FieldRow label="Gmail API" hint="Send EOD mails on your behalf">
          <StatusPill connected={!!session} />
        </FieldRow>
        <FieldRow label="Google Sheets API" hint="Read task rows and hours">
          <StatusPill connected={!!session} />
        </FieldRow>
        <FieldRow label="Zoho OAuth" hint="Tasks · logs · status sync">
          <StatusPill connected={false} />
          <ActionButton variant="primary">Connect</ActionButton>
        </FieldRow>
      </SettingsCard>

      <SettingsCard title="Session & tokens">
        <FieldRow
          label="Auto-refresh tokens"
          hint="Refresh OAuth tokens before they expire"
        >
          <Toggle defaultChecked />
        </FieldRow>
        <FieldRow label="Session timeout" hint="Sign out after inactivity">
          <Select
            options={["8 hours", "24 hours", "7 days"]}
            defaultValue="8 hours"
          />
        </FieldRow>
      </SettingsCard>
    </div>
  );
}
