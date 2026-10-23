import { AdminAuthController } from "@/controllers";

export const dynamic = "force-dynamic";

export async function POST() {
  return AdminAuthController.logout();
}
