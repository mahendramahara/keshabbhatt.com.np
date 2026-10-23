import { NextRequest } from "next/server";
import { AdminAuthController } from "@/controllers";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  return AdminAuthController.login(request);
}
