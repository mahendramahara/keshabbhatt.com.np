import type { Metadata } from "next";
import { CvManager } from "@/components/admin";

export const metadata: Metadata = {
  title: "Executive CV Management",
};

export default function AdminCvPage() {
  return <CvManager />;
}
