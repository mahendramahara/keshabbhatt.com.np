import { NextRequest } from "next/server";
import { AdminService } from "@/services";
import { createAdminSchema, updateAdminSchema } from "@keshab-bhatt/validation";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { apiSuccess, apiError, apiValidationError, apiUnauthorized, apiForbidden, apiNotFound } from "@/utils";
import type { AdminCreateInput, AdminUpdateInput } from "@keshab-bhatt/types";

export class AdminUserController {
  /**
   * List all admins
   */
  static async getAdmins(req: NextRequest) {
    try {
      const auth = getAuthenticatedAdmin(req);
      if (!auth) {
        return apiUnauthorized();
      }

      const admins = await AdminService.getAdmins();
      return apiSuccess(admins, "Admins retrieved successfully.");
    } catch (error) {
      console.error("[AdminUserController.getAdmins] Error:", error);
      return apiError("Failed to retrieve admins.", "ADMIN_FETCH_ERROR", 500);
    }
  }

  /**
   * Create new admin - Only Superadmin can create!
   */
  static async createAdmin(req: NextRequest) {
    try {
      const auth = getAuthenticatedAdmin(req);
      if (!auth) {
        return apiUnauthorized();
      }

      if (auth.role !== "superadmin") {
        return apiForbidden("Only the Super Admin can create new admin accounts.");
      }

      const body = await req.json().catch(() => null);
      if (!body) {
        return apiError("Request body must be valid JSON.", "INVALID_JSON", 400);
      }

      const parseResult = createAdminSchema.safeParse(body);
      if (!parseResult.success) {
        return apiValidationError(parseResult.error.flatten());
      }

      const input = parseResult.data as AdminCreateInput;
      const created = await AdminService.createAdmin(input);

      return apiSuccess(created, "Admin created successfully.", 201);
    } catch (error) {
      console.error("[AdminUserController.createAdmin] Error:", error);
      return apiError(
        error instanceof Error ? error.message : "Failed to create admin.",
        "ADMIN_CREATE_ERROR",
        400
      );
    }
  }

  /**
   * Update admin
   */
  static async updateAdmin(req: NextRequest, id: string) {
    try {
      const auth = getAuthenticatedAdmin(req);
      if (!auth) {
        return apiUnauthorized();
      }

      // Non-superadmins can only update their own account, and cannot change role
      if (auth.role !== "superadmin" && auth.id !== id) {
        return apiForbidden("You are not permitted to modify other admin accounts.");
      }

      const body = await req.json().catch(() => null);
      if (!body) {
        return apiError("Request body must be valid JSON.", "INVALID_JSON", 400);
      }

      const parseResult = updateAdminSchema.safeParse(body);
      if (!parseResult.success) {
        return apiValidationError(parseResult.error.flatten());
      }

      const input = parseResult.data as AdminUpdateInput;

      // If not superadmin, strip role change
      if (auth.role !== "superadmin") {
        delete input.role;
      }

      const updated = await AdminService.updateAdmin(id, input);
      if (!updated) {
        return apiNotFound(`Admin with ID '${id}'`);
      }

      return apiSuccess(updated, "Admin updated successfully.");
    } catch (error) {
      console.error(`[AdminUserController.updateAdmin] (${id}) Error:`, error);
      return apiError(
        error instanceof Error ? error.message : "Failed to update admin.",
        "ADMIN_UPDATE_ERROR",
        400
      );
    }
  }

  /**
   * Delete admin - Super admin cannot be deleted!
   */
  static async deleteAdmin(req: NextRequest, id: string) {
    try {
      const auth = getAuthenticatedAdmin(req);
      if (!auth) {
        return apiUnauthorized();
      }

      if (auth.role !== "superadmin") {
        return apiForbidden("Only the Super Admin can delete admin accounts.");
      }

      if (auth.id === id) {
        return apiForbidden("You cannot delete your own active superadmin account.");
      }

      const success = await AdminService.deleteAdmin(id);
      if (!success) {
        return apiNotFound(`Admin with ID '${id}'`);
      }

      return apiSuccess({ deleted: true, id }, "Admin deleted successfully.");
    } catch (error) {
      console.error(`[AdminUserController.deleteAdmin] (${id}) Error:`, error);
      return apiError(
        error instanceof Error ? error.message : "Failed to delete admin.",
        "ADMIN_DELETE_ERROR",
        400
      );
    }
  }
}

export default AdminUserController;
