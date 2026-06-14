"use client";

import {
  FieldRow,
  SaveButton,
  SettingsCard,
  TextInput,
  Toggle,
} from "../ui/SettingsCard";

export function SheetTab() {
  return (
    <div>
      <SettingsCard title="Google Sheet config">
        <FieldRow
          label="Spreadsheet ID"
          hint="Found in the sheet URL after /d/"
        >
          <TextInput placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms" />
        </FieldRow>
        <FieldRow
          label="Sheet tab name"
          hint="Exact tab name to read tasks from"
        >
          <TextInput placeholder="EOD Tasks" />
        </FieldRow>
        <FieldRow label="Task column" hint="Column header for task name">
          <TextInput placeholder="Task" />
        </FieldRow>
        <FieldRow label="Hours column" hint="Column header for hours logged">
          <TextInput placeholder="Hours" />
        </FieldRow>
        <FieldRow
          label="Status column"
          hint="Column header for task status (optional)"
        >
          <TextInput placeholder="Status" />
        </FieldRow>
        <FieldRow
          label="Skip empty rows"
          hint="Ignore rows where the hours cell is blank"
        >
          <Toggle defaultChecked />
        </FieldRow>
        <FieldRow label="Header row" hint="Which row contains column headers">
          <TextInput placeholder="1" className="w-16" />
        </FieldRow>
      </SettingsCard>

      <SettingsCard title="Data range">
        <FieldRow label="Start column" hint="First column to read (e.g. A)">
          <TextInput placeholder="A" className="w-16" />
        </FieldRow>
        <FieldRow label="End column" hint="Last column to read (e.g. F)">
          <TextInput placeholder="F" className="w-16" />
        </FieldRow>
      </SettingsCard>

      <SaveButton />
    </div>
  );
}
