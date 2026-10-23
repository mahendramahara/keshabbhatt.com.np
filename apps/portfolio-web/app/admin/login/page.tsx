import type { Metadata } from "next";
import { AdminLoginCard } from "@/components/admin";

export const metadata: Metadata = {
  title: "Admin Portal Sign In | Keshab Datt Bhatt",
  description: "Secure administrator sign-in for Keshab Datt Bhatt executive management portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return <AdminLoginCard />;
}
