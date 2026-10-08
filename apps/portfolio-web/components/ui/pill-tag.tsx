import React from "react";
import { DynamicIcon } from "../dynamic-icon";

interface PillTagProps {
  icon?: string;
  label: string;
  className?: string;
}

export function PillTag({ icon, label, className = "" }: PillTagProps) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 text-xs font-semibold text-[var(--text-main)] shadow-sm ${className}`}
    >
      {icon && (
        <div className="p-1.5 rounded-md bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]">
          <DynamicIcon name={icon} className="w-3.5 h-3.5" />
        </div>
      )}
      <span>{label}</span>
    </div>
  );
}
