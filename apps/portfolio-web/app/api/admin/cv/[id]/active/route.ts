import { NextRequest } from "next/server";
import { CvController } from "@/controllers";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { apiUnauthorized } from "@/utils";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthenticatedAdmin(request);
  if (!auth) {
    return apiUnauthorized();
  }
  const { id } = await params;
  return CvController.setActive(request, id);
}
