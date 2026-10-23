import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/services";
import { adminLoginSchema } from "@keshab-bhatt/validation";
import { signAdminToken, setAdminAuthCookie, clearAdminAuthCookie, getAuthenticatedAdmin } from "@/lib/auth";
import { apiSuccess, apiError, apiValidationError, apiUnauthorized } from "@/utils";

export class AdminAuthController {
  /**
   * Handle admin login (supports username or email)
   */
  static async login(req: NextRequest) {
    try {
      const body = await req.json().catch(() => null);
      if (!body) {
        return apiError("Request body must be valid JSON.", "INVALID_JSON", 400);
      }

      const parseResult = adminLoginSchema.safeParse(body);
      if (!parseResult.success) {
        return apiValidationError(parseResult.error.flatten());
      }

      const { identifier, password } = parseResult.data;
      const admin = await AdminService.authenticate(identifier, password);

      if (!admin) {
        return apiUnauthorized("Invalid username/email or password.");
      }

      const token = signAdminToken(admin);

      // Create success response and set HTTP-only cookie
      const res = NextResponse.json({
        success: true,
        data: {
          admin,
          token,
        },
        message: "Login successful.",
      });

      setAdminAuthCookie(res, token);
      return res;
    } catch (error) {
      console.error("[AdminAuthController.login] Error:", error);
      return apiError(
        error instanceof Error ? error.message : "Internal login error.",
        "LOGIN_ERROR",
        500
      );
    }
  }

  /**
   * Handle admin logout
   */
  static async logout() {
    const res = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
    clearAdminAuthCookie(res);
    return res;
  }

  /**
   * Get current authenticated admin profile
   */
  static async getMe(req: NextRequest) {
    try {
      const auth = getAuthenticatedAdmin(req);
      if (!auth) {
        return apiUnauthorized("You must be logged in to access this resource.");
      }

      const admin = await AdminService.getAdminById(auth.id);
      if (!admin || !admin.isActive) {
        return apiUnauthorized("User account not found or deactivated.");
      }

      return apiSuccess(admin, "Admin profile retrieved.");
    } catch (error) {
      console.error("[AdminAuthController.getMe] Error:", error);
      return apiError("Failed to fetch admin profile.", "AUTH_ERROR", 500);
    }
  }
}

export default AdminAuthController;
