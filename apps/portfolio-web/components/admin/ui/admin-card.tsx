import React from "react";

export interface AdminCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  title,
  subtitle,
  action,
  children,
  className = "",
  bodyClassName = "p-5",
}) => {
  return (
    <div
      className={`rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--shadow-card)] overflow-hidden ${className}`}
    >
      {(title || action) && (
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-[var(--text-main)] leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};

export default AdminCard;
