import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import type { AdminUser, AdminRole } from "@keshab-bhatt/types";

const JWT_SECRET = process.env.JWT_SECRET || "keshab-bhatt-portfolio-admin-secret-2025-secure";
export const ADMIN_COOKIE_NAME = "admin_token";

export interface AdminJwtPayload {
  id: string;
  name: string;
  email: string;
  username: string;
  role: AdminRole;
}

/**
 * Sign JWT token for authenticated admin
 */
export function signAdminToken(admin: AdminUser): string {
  const payload: AdminJwtPayload = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    username: admin.username,
    role: admin.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

/**
 * Verify JWT token
 */
export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
  } catch {
    return null;
  }
}

/**
 * Extract token from Authorization header or HTTP-only cookie
 */
export function extractTokenFromRequest(req: NextRequest): string | null {
  // 1. Check Authorization: Bearer <token>
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }

  // 2. Check Cookie
  const cookieToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Get authenticated admin from request, or null
 */
export function getAuthenticatedAdmin(req: NextRequest): AdminJwtPayload | null {
  const token = extractTokenFromRequest(req);
  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Set admin session cookie on response
 */
export function setAdminAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear admin session cookie
 */
export function clearAdminAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
