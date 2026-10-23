import React from "react";

export interface AdminStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
}

export const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--shadow-card)] flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-bold text-[var(--text-main)] tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>}
        {trend && (
          <p
            className={`text-xs font-medium inline-flex items-center gap-1 ${
              trend.isPositive ? "text-emerald-500" : "text-red-500"
            }`}
          >
            <span>{trend.isPositive ? "↑" : "↓"}</span>
            <span>{trend.value}</span>
          </p>
        )}
      </div>

      <div className="p-3 rounded-xl bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] shrink-0">
        {icon}
      </div>
    </div>
  );
};

export default AdminStatsCard;
