"use client";

import {
  FieldRow,
  SaveButton,
  Select,
  SettingsCard,
  TextInput,
  Toggle,
} from "../ui/SettingsCard";

export function ProjectsTab() {
  return (
    <div>
      <SettingsCard title="Zoho project mappings">
        <FieldRow
          label="Default project ID"
          hint="Fallback when no sheet mapping is found"
        >
          <TextInput placeholder="675432" />
        </FieldRow>
        <FieldRow label="Alpha project" hint="Zoho Project ID for Alpha">
          <TextInput placeholder="123456" />
        </FieldRow>
        <FieldRow label="Beta project" hint="Zoho Project ID for Beta">
          <TextInput placeholder="789012" />
        </FieldRow>
        <FieldRow label="Gamma project" hint="Zoho Project ID for Gamma">
          <TextInput placeholder="345678" />
        </FieldRow>
      </SettingsCard>

      <SettingsCard title="Sync behaviour">
        <FieldRow
          label="Auto-create tasks"
          hint="Create tasks in Zoho if they don't exist (Mode 2 / 4)"
        >
          <Toggle />
        </FieldRow>
        <FieldRow
          label="Auto-upsert logs"
          hint="Update existing log entries instead of creating new ones"
        >
          <Toggle defaultChecked />
        </FieldRow>
        <FieldRow
          label="Default task status"
          hint="Status set when a task is first created"
        >
          <Select
            options={["In Progress", "Open", "On Hold", "Closed"]}
            defaultValue="In Progress"
          />
        </FieldRow>
        <FieldRow
          label="Log format"
          hint="How task descriptions are written to Zoho"
        >
          <Select
            options={["Task name + hours", "Task name only", "Full row JSON"]}
            defaultValue="Task name + hours"
          />
        </FieldRow>
      </SettingsCard>

      <SaveButton />
    </div>
  );
}
