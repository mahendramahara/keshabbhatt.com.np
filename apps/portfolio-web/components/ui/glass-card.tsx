import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function GlassCard({
  children,
  className = "",
  hoverable = true,
}: GlassCardProps) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-md ${
        hoverable ? "card-hover-effect" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
