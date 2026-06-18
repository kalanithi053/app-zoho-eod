"use client";

import { buildSheetPayload } from "@/builders/user.builder";
import templateService from "@/service/template.service";
import { useUserStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import {
  FieldRow,
  SaveButton,
  SettingsCard,
  TextInput,
} from "../ui/SettingsCard";

export function SheetTab() {
  const { user, setUser } = useUserStore();
  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { sheet } = user?.configuration ?? {};
    setForm({
      ...sheet,
    });
  }, [user]);

  const handleChange = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateSheet = () => {
    const regex = /^[A-Za-z0-9_ ]+![A-Z]+:[A-Z]+$/;
    const indexes = [
      form.taskNameIndex,
      form.durationIndex,
      form.statusIndex,
      form.dateIndex,
      form.projectIndex,
    ]
      .filter((v) => v !== "" && v !== null && v !== undefined)
      .map(Number);

    const hasDuplicates = new Set(indexes).size !== indexes.length;
    if (!regex.test(form.sheetTabName)) {
      throw new Error(
        "Invalid sheet tab name format. Use SheetName!ColumnStart:ColumnEnd",
      );
    }
    if (hasDuplicates) {
      throw new Error("Each column index must be unique."); // TODO
    }
  };

  const handleSave = async () => {
    try {
      validateSheet();
      const payload = buildSheetPayload(form, user ?? {});
      setLoading(true);
      const res = await templateService.updateCurrentUser(payload);
      if (res?.success) {
        // TODO
        setUser(res?.data);
      }
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SettingsCard title="Google Sheet config">
        <FieldRow
          label="Spreadsheet ID"
          hint="Found in the sheet URL after /d/"
        >
          <TextInput
            defaultValue={form.id}
            onChange={(value) => handleChange("id", value)}
            placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
          />
        </FieldRow>

        <FieldRow
          label="Sheet tab name"
          hint="Exact tab name to read tasks from"
        >
          <TextInput
            defaultValue={form.sheetTabName}
            onChange={(value) => handleChange("sheetTabName", value)}
            placeholder="SheetName!ColumnStart:ColumnEnd"
          />
        </FieldRow>

        <FieldRow
          label="Task column index"
          hint="Zero-based index of the task column"
        >
          <TextInput
            type="number"
            defaultValue={form.taskNameIndex}
            onChange={(value) => handleChange("taskNameIndex", value)}
            placeholder="0"
            className="w-20"
          />
        </FieldRow>

        <FieldRow
          label="Hours column index"
          hint="Zero-based index of the duration column"
        >
          <TextInput
            type="number"
            defaultValue={form.durationIndex}
            onChange={(value) => handleChange("durationIndex", value)}
            placeholder="1"
            className="w-20"
          />
        </FieldRow>

        <FieldRow
          label="Date column index"
          hint="Zero-based index of the date column"
        >
          <TextInput
            type="number"
            defaultValue={form.dateIndex}
            onChange={(value) => handleChange("dateIndex", value)}
            placeholder="3"
            className="w-20"
          />
        </FieldRow>
        <FieldRow
          label="Project column index"
          hint="Zero-based index of the project column"
        >
          <TextInput
            type="number"
            defaultValue={form.projectIndex}
            onChange={(value) => handleChange("projectIndex", value)}
            placeholder="2"
            className="w-20"
          />
        </FieldRow>
        <FieldRow
          label="Status column index"
          hint="Zero-based index of the status column"
        >
          <TextInput
            type="number"
            defaultValue={form.statusIndex}
            onChange={(value) => handleChange("statusIndex", value)}
            placeholder="2"
            className="w-20"
          />
        </FieldRow>
      </SettingsCard>

      <SaveButton loading={loading} onClick={handleSave} />
    </div>
  );
}
{
  /* <SettingsCard title="Data range">
        <FieldRow label="Start column" hint="First column to read (e.g. A)">
          <TextInput placeholder="A" className="w-16" />
        </FieldRow>
        <FieldRow label="End column" hint="Last column to read (e.g. F)">
          <TextInput placeholder="F" className="w-16" />
        </FieldRow>
      </SettingsCard> */
}
