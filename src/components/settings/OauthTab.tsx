"use client";
import templateService from "@/service/template.service";
import { useUserStore } from "@/store/useAuthStore";
import {
  ActionButton,
  FieldRow,
  SettingsCard,
  StatusPill,
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
    // TODO:
  };
  // TODO tab=oauth&status=success&Module=zoho check on the search param and trigger toast for oauth success for zoho
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
    </div>
  );
}
