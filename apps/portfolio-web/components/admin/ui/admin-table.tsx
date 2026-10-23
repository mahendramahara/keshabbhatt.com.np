import React from "react";

export interface AdminTableProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminTable: React.FC<AdminTableProps> = ({ children, className = "" }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-[var(--border-subtle)] ${className}`}>
      <table className="w-full text-left text-sm text-[var(--text-main)] divide-y divide-[var(--border-subtle)]">
        {children}
      </table>
    </div>
  );
};

export const AdminTableHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <thead
      className={`bg-[var(--bg-card-inner)] text-xs uppercase font-semibold text-[var(--text-muted)] tracking-wider ${className}`}
    >
      {children}
    </thead>
  );
};

export const AdminTableBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <tbody className={`divide-y divide-[var(--border-subtle)] bg-[var(--bg-card)] ${className}`}>
      {children}
    </tbody>
  );
};

export const AdminTableRow: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = "", onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors hover:bg-[var(--bg-card-hover)] ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </tr>
  );
};

export const AdminTableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
  isHeader?: boolean;
}> = ({ children, className = "", isHeader = false }) => {
  if (isHeader) {
    return <th className={`px-4 py-3.5 font-semibold ${className}`}>{children}</th>;
  }
  return <td className={`px-4 py-3.5 text-[var(--text-sub)] ${className}`}>{children}</td>;
};

export default AdminTable;
