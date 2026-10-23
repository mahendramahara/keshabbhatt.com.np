"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LocaleAdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-app)]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-gold)] border-t-transparent" />
        <p className="text-xs text-[var(--text-muted)]">Loading Admin Dashboard...</p>
      </div>
    </div>
  );
}
