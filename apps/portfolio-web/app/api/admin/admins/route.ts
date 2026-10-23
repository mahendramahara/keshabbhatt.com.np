import { NextRequest } from "next/server";
import { AdminUserController } from "@/controllers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return AdminUserController.getAdmins(request);
}

export async function POST(request: NextRequest) {
  return AdminUserController.createAdmin(request);
}
