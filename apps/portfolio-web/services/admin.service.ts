import { connectDatabase } from "@/config/database";
import { Admin } from "@/models";
import type {
  AdminUser,
  AdminCreateInput,
  AdminUpdateInput,
} from "@keshab-bhatt/types";

export class AdminService {
  /**
   * Authenticate admin by username or email and verify password
   */
  static async authenticate(
    identifier: string,
    candidatePassword: string
  ): Promise<AdminUser | null> {
    await connectDatabase();

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Search by username or email, including password field
    const admin = await Admin.findOne({
      $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }],
      isActive: true,
    })
      .select("+password")
      .exec();

    if (!admin) {
      return null;
    }

    const isMatch = await admin.comparePassword(candidatePassword);
    if (!isMatch) {
      return null;
    }

    return admin.toSafeObject();
  }

  /**
   * Get all admins
   */
  static async getAdmins(): Promise<AdminUser[]> {
    await connectDatabase();
    const admins = await Admin.find().sort({ role: 1, createdAt: -1 }).exec();
    return admins.map((a) => a.toSafeObject());
  }

  /**
   * Get admin by ID
   */
  static async getAdminById(id: string): Promise<AdminUser | null> {
    await connectDatabase();
    const admin = await Admin.findById(id).exec();
    return admin ? admin.toSafeObject() : null;
  }

  /**
   * Create a new admin
   */
  static async createAdmin(input: AdminCreateInput): Promise<AdminUser> {
    await connectDatabase();

    const cleanEmail = input.email.trim().toLowerCase();
    const cleanUsername = input.username.trim().toLowerCase();

    const existing = await Admin.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existing) {
      if (existing.email === cleanEmail) {
        throw new Error("An admin with this email already exists");
      }
      throw new Error("An admin with this username already exists");
    }

    const newAdmin = await Admin.create({
      name: input.name.trim(),
      email: cleanEmail,
      username: cleanUsername,
      password: input.password, // Pre-save hook hashes with salt
      role: input.role || "admin",
      isActive: true,
    });

    return newAdmin.toSafeObject();
  }

  /**
   * Update an existing admin
   */
  static async updateAdmin(id: string, input: AdminUpdateInput): Promise<AdminUser | null> {
    await connectDatabase();

    const admin = await Admin.findById(id).exec();
    if (!admin) return null;

    if (input.name !== undefined) admin.name = input.name.trim();

    if (input.email !== undefined) {
      const cleanEmail = input.email.trim().toLowerCase();
      if (cleanEmail !== admin.email) {
        const conflict = await Admin.findOne({ email: cleanEmail, _id: { $ne: id } });
        if (conflict) throw new Error("An admin with this email already exists");
        admin.email = cleanEmail;
      }
    }

    if (input.username !== undefined) {
      const cleanUsername = input.username.trim().toLowerCase();
      if (cleanUsername !== admin.username) {
        const conflict = await Admin.findOne({ username: cleanUsername, _id: { $ne: id } });
        if (conflict) throw new Error("An admin with this username already exists");
        admin.username = cleanUsername;
      }
    }

    if (input.password && input.password.trim().length >= 6) {
      admin.password = input.password; // Triggers pre-save hash
    }

    // Protect superadmin from being demoted
    if (admin.role === "superadmin" && input.role && input.role !== "superadmin") {
      throw new Error("Cannot demote the superadmin role");
    }

    if (input.role !== undefined && admin.role !== "superadmin") {
      admin.role = input.role;
    }

    if (input.isActive !== undefined) {
      if (admin.role === "superadmin" && !input.isActive) {
        throw new Error("Cannot deactivate the superadmin account");
      }
      admin.isActive = input.isActive;
    }

    await admin.save();
    return admin.toSafeObject();
  }

  /**
   * Delete admin - strictly prohibits deleting superadmin!
   */
  static async deleteAdmin(id: string): Promise<boolean> {
    await connectDatabase();

    const admin = await Admin.findById(id).exec();
    if (!admin) return false;

    if (admin.role === "superadmin") {
      throw new Error("Permission Denied: The superadmin account cannot be deleted under any circumstances.");
    }

    const res = await Admin.findByIdAndDelete(id).exec();
    return Boolean(res);
  }
}

export default AdminService;
