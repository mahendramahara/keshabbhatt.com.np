import { NextRequest } from "next/server";
import { BlogService } from "@/services";
import { AdminService } from "@/services";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { apiSuccess, apiUnauthorized, apiError } from "@/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthenticatedAdmin(request);
    if (!auth) {
      return apiUnauthorized();
    }

    const [blogStats, admins] = await Promise.all([
      BlogService.getStats(),
      AdminService.getAdmins(),
    ]);

    return apiSuccess(
      {
        ...blogStats,
        totalAdmins: admins.length,
        superAdminCount: admins.filter((a) => a.role === "superadmin").length,
      },
      "Admin stats retrieved successfully."
    );
  } catch (error) {
    console.error("[api/admin/stats] Error:", error);
    return apiError("Failed to fetch admin stats.", "STATS_ERROR", 500);
  }
}
