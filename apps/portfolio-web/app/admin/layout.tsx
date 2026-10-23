import React from "react";
import type { Metadata } from "next";
import { AdminClientProvider } from "@/components/admin";

export const metadata: Metadata = {
  title: {
    default: "Executive Administration Portal | Keshab Datt Bhatt",
    template: "%s | Admin Portal | Keshab Datt Bhatt",
  },
  description: "Secure executive administration management portal.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClientProvider>{children}</AdminClientProvider>;
}
