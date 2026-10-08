import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  target?: string;
  rel?: string;
}

export function PrimaryButton({
  children,
  href,
  onClick,
  className = "",
  target,
  rel,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent-gold)] text-[var(--text-inverted)] font-semibold text-xs sm:text-sm tracking-wide shadow-md hover:bg-[var(--accent-gold-hover)] hover:shadow-lg transition-all cursor-pointer";

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={`${baseClasses} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} type="button" className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
}

export function OutlineButton({
  children,
  href,
  onClick,
  className = "",
  target,
  rel,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold text-xs sm:text-sm tracking-wide hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer";

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={`${baseClasses} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} type="button" className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
}
