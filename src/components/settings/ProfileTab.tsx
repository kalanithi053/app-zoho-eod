"use client";

import { buildPayload } from "@/builders/user.builder";
import { cronOptions } from "@/common/cronOptions";
import templateService from "@/service/template.service";
import { useUserStore } from "@/store/useAuthStore";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useAlert } from "../ui/Alert";
import {
  FieldRow,
  SaveButton,
  Select,
  SettingsCard,
  TextInput,
  Toggle,
} from "../ui/SettingsCard";

// ─────────────────────────────────────────────────────────────
// Utils
// ─────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email: string) => EMAIL_REGEX.test(email);

const validateEmails = (emails: string[]) => {
  const invalid = emails.find((email) => !isValidEmail(email));

  if (invalid) {
    throw new Error(`Invalid email address: ${invalid}`);
  }
};

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface ProfileForm {
  name: string;
  eodMailTo: string[];
  eodMailCc: string[];
  eodMailBcc: string[];
  jobFailureTriggerRecipient: string;
  cronOption: string;
  triggerCron: boolean;
}

interface EmailChipInputProps {
  emails: string[];
  onChange: (emails: string[]) => void;
  placeholder?: string;
}

// ─────────────────────────────────────────────────────────────
// Email Chip Input
// ─────────────────────────────────────────────────────────────

const EmailChipInput = memo(
  ({
    emails,
    onChange,
    placeholder = "Add email and press Enter",
  }: EmailChipInputProps) => {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const addEmail = useCallback(
      (raw: string) => {
        const email = raw.trim().toLowerCase();

        if (!email) return;

        if (!isValidEmail(email)) {
          setError("Invalid email address.");
          return;
        }

        if (emails.some((e) => e.toLowerCase() === email)) {
          setError("Email already added.");
          return;
        }

        onChange([...emails, email]);
        setInputValue("");
        setError("");
      },
      [emails, onChange],
    );

    const removeEmail = useCallback(
      (index: number) => {
        onChange(emails.filter((_, i) => i !== index));
      },
      [emails, onChange],
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addEmail(inputValue);
      } else if (e.key === "Backspace" && !inputValue && emails.length) {
        removeEmail(emails.length - 1);
      }
    };

    const handleBlur = () => {
      if (inputValue.trim()) {
        addEmail(inputValue);
      }
    };

    return (
      <div className="w-full">
        <div
          className="flex flex-wrap gap-2 min-h-[42px] w-full rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {emails.map((email, index) => (
            <span
              key={`${email}-${index}`}
              className="inline-flex items-center gap-1 rounded-md bg-zinc-700 px-2 py-1 text-xs font-medium text-zinc-200"
            >
              {email}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeEmail(index);
                }}
                className="text-zinc-400 hover:text-zinc-100"
              >
                ×
              </button>
            </span>
          ))}

          <input
            ref={inputRef}
            type="email"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);

              if (error) {
                setError("");
              }
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={emails.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[180px] border-none bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 outline-none"
          />
        </div>

        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);

EmailChipInput.displayName = "EmailChipInput";

// ─────────────────────────────────────────────────────────────
// Profile Tab
// ─────────────────────────────────────────────────────────────

export function ProfileTab() {
  const { user, setUser } = useUserStore();
  const { showAlert, AlertContainer } = useAlert();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    eodMailTo: [],
    eodMailCc: [],
    eodMailBcc: [],
    jobFailureTriggerRecipient: "",
    cronOption: "",
    triggerCron: false,
  });

  const handleChange = useCallback(
    <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  useEffect(() => {
    if (!user) return;

    const { recipient, ...config } = user.configuration ?? {};

    setForm({
      name: user.name ?? "",
      eodMailTo: recipient?.eodMailTo ?? [],
      eodMailCc: recipient?.eodMailCc ?? [],
      eodMailBcc: recipient?.eodMailBcc ?? [],
      jobFailureTriggerRecipient: config.jobFailureTriggerRecipient ?? "",
      cronOption: config.cronOption ?? "",
      triggerCron: config.triggerCron ?? false,
    });
  }, [user]);

  const validateForm = useCallback(() => {
    if (!form.name.trim()) {
      throw new Error("Name is required.");
    }
    if (!form.eodMailTo?.length) {
      throw new Error(
        "Please enter a valid Primary recipients of the daily summary",
      );
    } else {
      validateEmails(form.eodMailTo);
    }
    if (form.eodMailCc?.length) validateEmails(form.eodMailCc);
    if (form.eodMailBcc?.length) validateEmails(form.eodMailBcc);

    if (form.jobFailureTriggerRecipient) {
      validateEmails([form.jobFailureTriggerRecipient]);
    }
  }, [form]);

  const triggerOnSave = useCallback(async () => {
    try {
      setLoading(true);

      validateForm();

      const payload = buildPayload(form, user ?? {});

      const res = await templateService.updateCurrentUser(payload);

      if (!res?.success) {
        throw new Error("Failed to save settings.");
      }

      setUser(res.data);

      showAlert({
        type: "success",
        message: "Settings saved successfully.",
        duration: 4000,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      showAlert({
        type: "error",
        message,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [form, user, setUser, validateForm, showAlert]);

  return (
    <div>
      <AlertContainer />

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
      </SettingsCard>

      <SettingsCard title="EOD mail recipients">
        <FieldRow label="To" hint="Primary recipients of the daily summary">
          <EmailChipInput
            emails={form.eodMailTo}
            onChange={(emails) => handleChange("eodMailTo", emails)}
            placeholder="Add recipient and press Enter"
          />
        </FieldRow>

        <FieldRow label="CC" hint="Copied on the daily summary">
          <EmailChipInput
            emails={form.eodMailCc}
            onChange={(emails) => handleChange("eodMailCc", emails)}
            placeholder="Add CC and press Enter"
          />
        </FieldRow>

        <FieldRow label="BCC" hint="Blind copied on the daily summary">
          <EmailChipInput
            emails={form.eodMailBcc}
            onChange={(emails) => handleChange("eodMailBcc", emails)}
            placeholder="Add BCC and press Enter"
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

        <FieldRow label="Trigger Cron">
          <Toggle
            defaultChecked={form.triggerCron}
            onChange={(value) => handleChange("triggerCron", value)}
          />
        </FieldRow>
      </SettingsCard>

      <SaveButton loading={loading} onClick={triggerOnSave} />
    </div>
  );
}
