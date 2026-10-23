import React from "react";
import { Loader2 } from "lucide-react";

export type AdminButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
export type AdminButtonSize = "sm" | "md" | "lg";

export interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminButtonVariant;
  size?: AdminButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-[var(--accent-gold)] hover:brightness-105 active:scale-[0.99] text-[var(--btn-primary-text)] font-semibold shadow-sm focus:ring-[var(--accent-gold)]",
    secondary:
      "bg-[var(--bg-card-inner)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:ring-[var(--border-subtle)]",
    outline:
      "border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold-soft)] text-[var(--text-main)] focus:ring-[var(--accent-gold)]",
    danger:
      "bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white shadow-sm focus:ring-red-500",
    ghost:
      "hover:bg-[var(--accent-gold-soft)] text-[var(--text-sub)] hover:text-[var(--text-main)] focus:ring-[var(--accent-gold)]",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};

export default AdminButton;
