import React from "react";

export const AdminFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[var(--bg-card)] border-t border-[var(--border-subtle)] px-6 py-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
        <div>
          © {new Date().getFullYear()} Keshab Datt Bhatt. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>Executive Administration Suite</span>
          <span>•</span>
          <span className="text-[var(--accent-gold)] font-medium">MongoDB + Mongoose Engine</span>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
