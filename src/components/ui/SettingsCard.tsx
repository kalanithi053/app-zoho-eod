import clsx from "clsx";

export function SettingsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-4">
      <div className="px-4 py-3 border-b border-zinc-800">
        <p className="text-sm font-medium text-zinc-200">{title}</p>
      </div>
      <div className="divide-y divide-zinc-800">{children}</div>
    </div>
  );
}

export function FieldRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm text-zinc-200">{label}</p>
        {hint && <p className="text-xs text-zinc-500 mt-0.5">{hint}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">{children}</div>
    </div>
  );
}

export function Toggle({
  defaultChecked = false,
  onChange,
}: {
  defaultChecked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={defaultChecked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <div className="w-9 h-5 bg-zinc-700 peer-checked:bg-brand-400 rounded-full transition-colors" />
      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
    </label>
  );
}

export function TextInput({
  placeholder,
  defaultValue = "",
  type = "text",
  className,
  onChange,
}: {
  placeholder?: string;
  defaultValue?: string;
  type?: string;
  className?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={defaultValue}
      onChange={(e) => onChange?.(e.target.value)}
      className={clsx(
        "w-52 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-brand-400 transition-colors",
        className,
      )}
    />
  );
}

export function Select({
  options,
  value = "",
  onChange,
  placeholder = "Select an option",
}: {
  options: { value: string | number; label: string }[];
  value?: string | number;
  placeholder?: string;
  onChange?: (value: string) => void;
}) {
  const selected =
    options.find((option) => option.value === value)?.value ?? "";

  return (
    <select
      value={selected}
      onChange={(e) => onChange?.(e.target.value)}
      className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-brand-400 transition-colors cursor-pointer"
    >
      <option value="" disabled>
        {placeholder}
      </option>

      {options.map((option) => (
        <option key={option.value} value={option.value.toString()}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function SaveButton({
  onClick,
  label = "Save changes",
  loading = false,
}: {
  onClick?: () => void;
  label?: string | React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="flex justify-end mt-4">
      <button
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-400 hover:bg-brand-600 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed text-brand-900 font-medium text-sm rounded-lg transition-colors"
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}

        {loading ? "Saving..." : label}
      </button>
    </div>
  );
}

export function StatusPill({ connected }: { connected: boolean }) {
  return (
    <span
      className={clsx(
        "text-xs font-medium px-2.5 py-1 rounded-full",
        connected
          ? "bg-brand-400/10 text-brand-400"
          : "bg-zinc-800 text-zinc-500",
      )}
    >
      {connected ? "Connected" : "Not connected"}
    </span>
  );
}

export function ActionButton({
  children,
  variant = "default",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "default" | "danger" | "primary";
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors",
        variant === "danger" &&
          "border-red-800 text-red-400 hover:bg-red-500/10",
        variant === "primary" &&
          "border-brand-600 text-brand-400 hover:bg-brand-400/10",
        variant === "default" &&
          "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200",
      )}
    >
      {children}
    </button>
  );
}
