import React, { forwardRef } from "react";

export interface AdminSelectOption {
  value: string;
  label: string;
  color?: string;
}

export interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: AdminSelectOption[];
  placeholder?: string;
}

export const AdminSelect = forwardRef<HTMLSelectElement, AdminSelectProps>(
  ({ label, error, helperText, options, placeholder, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)]"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <select
          id={inputId}
          ref={ref}
          className={`w-full rounded-xl bg-[var(--bg-card)] border ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/15 focus:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
              : "border-[var(--border-card)] hover:border-[var(--accent-gold)]/40 focus:border-[var(--accent-gold)] focus:ring-4 focus:ring-[var(--accent-gold)]/15 focus:shadow-[0_0_24px_rgba(201,133,22,0.16)] shadow-xs"
          } px-3.5 py-2.5 text-sm text-[var(--text-main)] focus:outline-none transition-all duration-200 cursor-pointer ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[var(--text-muted)]">{helperText}</p>
        )}
      </div>
    );
  }
);

AdminSelect.displayName = "AdminSelect";
export default AdminSelect;
