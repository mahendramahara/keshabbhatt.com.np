import { NextRequest } from "next/server";
import { AdminUserController } from "@/controllers";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return AdminUserController.updateAdmin(request, id);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return AdminUserController.deleteAdmin(request, id);
}
