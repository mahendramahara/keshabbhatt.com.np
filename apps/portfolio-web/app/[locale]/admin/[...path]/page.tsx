"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";

interface LocaleAdminSubpathProps {
  params: Promise<{ path: string[] }>;
}

export default function LocaleAdminSubpathPage({ params }: LocaleAdminSubpathProps) {
  const router = useRouter();
  const { path } = use(params);
  const targetSubpath = Array.isArray(path) ? path.join("/") : "";

  useEffect(() => {
    router.replace(`/admin/${targetSubpath}`);
  }, [router, targetSubpath]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-app)]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-gold)] border-t-transparent" />
        <p className="text-xs text-[var(--text-muted)]">Redirecting to Admin Portal...</p>
      </div>
    </div>
  );
}
