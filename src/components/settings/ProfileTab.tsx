"use client";

import { buildPayload } from "@/builders/user.builder";
import { cronOptions } from "@/common/cronOptions";
import templateService from "@/service/template.service";
import { useUserStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import {
  FieldRow,
  SaveButton,
  Select,
  SettingsCard,
  TextInput,
} from "../ui/SettingsCard";

export function ProfileTab() {
  const { user, setUser } = useUserStore();
  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const handleChange = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    setForm({
      ...user,
      ...user?.configuration,
    });
  }, [user]);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    if (form.name && !form.name.trim()) {
      throw new Error("Name is required.");
    }

    if (form.eodMailRecipient && !isValidEmail(form.eodMailRecipient)) {
      throw new Error("Please enter a valid EOD mail recipient email.");
    }

    if (
      form.jobFailureTriggerRecipient &&
      !isValidEmail(form.jobFailureTriggerRecipient)
    ) {
      throw new Error("Please enter a valid job failure recipient email.");
    }
  };
  const triggerOnSave = async () => {
    try {
      setLoading(true);
      validateForm();
      const payload = buildPayload(form, user ?? {});
      const res = await templateService.updateCurrentUser(payload);
      if (res?.success) {
        setUser(res?.data);
        // TODO
      }
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <SettingsCard title="Your profile">
        <FieldRow label="Display name">
          <TextInput
            defaultValue={form.name}
            onChange={(value) => handleChange("name", value)}
            placeholder="Your name"
          />
        </FieldRow>
        <FieldRow label="Email" hint="Linked to your Google account">
          <span className="text-sm text-zinc-500">{user?.email ?? "—"}</span>
        </FieldRow>
        <FieldRow
          label="EOD mail recipient"
          hint="Who receives the daily summary"
        >
          <TextInput
            defaultValue={form.eodMailRecipient}
            onChange={(value) => handleChange("eodMailRecipient", value)}
            placeholder="manager@company.com"
            type="email"
          />
        </FieldRow>
      </SettingsCard>

      <SettingsCard title="Notifications">
        <FieldRow
          label="Job failure alerts"
          hint="Get notified when a cron job fails"
        >
          <TextInput
            defaultValue={form.jobFailureTriggerRecipient}
            onChange={(value) =>
              handleChange("jobFailureTriggerRecipient", value)
            }
            placeholder="manager@company.com"
            type="email"
          />
        </FieldRow>
      </SettingsCard>

      <SettingsCard title="Cron config defaults">
        <FieldRow
          label="Default trigger mode"
          hint="Which mode new crons use by default"
        >
          <Select
            options={cronOptions}
            value={form.cronOption}
            onChange={(value) => handleChange("cronOption", value)}
          />
        </FieldRow>
      </SettingsCard>

      <SaveButton loading={loading} onClick={() => triggerOnSave()} />
    </div>
  );
}
