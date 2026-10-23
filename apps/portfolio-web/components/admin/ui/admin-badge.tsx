import React from "react";

export type AdminBadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "gold";

export interface AdminBadgeProps {
  children: React.ReactNode;
  variant?: AdminBadgeVariant;
  color?: string; // Custom hex color
  size?: "sm" | "md";
  className?: string;
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  children,
  variant = "default",
  color,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] tracking-wide",
    md: "px-2.5 py-1 text-xs",
  };

  const variantClasses = {
    default: "bg-[var(--bg-card-inner)] text-[var(--text-sub)] border border-[var(--border-subtle)]",
    gold: "bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] border border-[var(--accent-gold-border)] font-semibold",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-medium",
    info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium",
  };

  const customStyle = color
    ? {
        backgroundColor: `${color}15`,
        borderColor: `${color}40`,
        color: color,
      }
    : undefined;

  return (
    <span
      style={customStyle}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium select-none ${
        sizeClasses[size]
      } ${!color ? variantClasses[variant] : ""} ${className}`}
    >
      {children}
    </span>
  );
};

export default AdminBadge;
