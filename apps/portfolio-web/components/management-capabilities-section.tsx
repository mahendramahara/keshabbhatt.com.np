import React from "react";
import { Users } from "lucide-react";
import type { ManagementCapabilityItem } from "@keshab-bhatt/types";
import { DynamicIcon } from "./dynamic-icon";

interface ManagementCapabilitiesSectionProps {
  title: string;
  items: ManagementCapabilityItem[];
}

export function ManagementCapabilitiesSection({ title, items }: ManagementCapabilitiesSectionProps) {
  return (
    <section id="management" className="py-7 sm:py-9 bg-[var(--bg-app)] border-b border-[var(--border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[var(--accent-blue-soft)] text-[var(--accent-blue-icon)]">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] tracking-tight">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs hover:shadow-md hover:border-[var(--accent-gold-border)] transition-all min-h-[145px] justify-start"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] flex items-center justify-center mb-2.5 shadow-xs border border-[var(--accent-gold-border)] shrink-0">
                <DynamicIcon name={item.icon} className="w-5 h-5" />
              </div>
              <h3 className="text-[12px] font-bold text-[var(--text-main)] mb-1.5 leading-snug">
                {item.title}
              </h3>
              <p className="text-[11px] leading-normal text-[var(--text-muted)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
