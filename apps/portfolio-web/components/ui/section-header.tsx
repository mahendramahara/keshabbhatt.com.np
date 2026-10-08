import React from "react";
import { DynamicIcon } from "../dynamic-icon";

interface SectionHeaderProps {
  title: string;
  icon?: string;
  badge?: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  title,
  icon,
  badge,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {badge && (
        <span className="inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] border border-[var(--accent-gold-border)]">
          {badge}
        </span>
      )}
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 rounded-lg bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] shrink-0">
            <DynamicIcon name={icon} className="w-5 h-5" />
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)]">
          {title}
        </h2>
      </div>
      {description && (
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
