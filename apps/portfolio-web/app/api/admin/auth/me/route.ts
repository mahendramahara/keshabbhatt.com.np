import { NextRequest } from "next/server";
import { AdminAuthController } from "@/controllers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return AdminAuthController.getMe(request);
}
