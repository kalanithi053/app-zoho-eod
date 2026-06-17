"use client";
import templateService from "@/service/template.service";
import { useUserStore } from "@/store/useAuthStore";
import {
  ActionButton,
  FieldRow,
  Select,
  SettingsCard,
  StatusPill,
  Toggle,
} from "../ui/SettingsCard";

export function OAuthTab() {
  const { user, setUser } = useUserStore();
  const triggerZohoOAuth = async () => {
    const res = await templateService.triggerZohoOAuth();
    window.location.href = res?.data;
  };
  const revokeZohoOAuth = async () => {
    const res = await templateService.revokeZohoOAuth();
    setUser(res.data);
    console.log(res);
  };
  return (
    <div>
      <SettingsCard title="Google OAuth">
        <FieldRow label="Google account" hint={user?.email ?? "Not signed in"}>
          <StatusPill connected={!!user?.configuration?.validatedGoogle} />
        </FieldRow>
        <FieldRow label="Gmail API" hint="Send EOD mails on your behalf">
          <StatusPill connected={!!user?.configuration?.validatedGoogle} />
        </FieldRow>
        <FieldRow label="Google Sheets API" hint="Read task rows and hours">
          <StatusPill connected={!!user?.configuration?.validatedGoogle} />
        </FieldRow>
        <FieldRow label="Zoho OAuth" hint="Tasks · logs · status sync">
          <StatusPill connected={!!user?.configuration?.validatedZoho} />
          {!user?.configuration?.validatedZoho ? (
            <ActionButton
              variant="primary"
              onClick={async () => triggerZohoOAuth()}
            >
              Connect
            </ActionButton>
          ) : (
            <ActionButton variant="danger" onClick={() => revokeZohoOAuth()}>
              Revoke
            </ActionButton>
          )}
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
