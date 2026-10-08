import { NextResponse } from "next/server";
import type { PaginationMeta } from "@keshab-bhatt/types";

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
  timestamp: string;
}

export function apiSuccess<T>(data: T, message?: string, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function apiPaginated<T>(
  data: T[],
  pagination: PaginationMeta,
  message?: string,
  status = 200
): NextResponse<ApiPaginatedResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      pagination,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function apiError(
  message: string,
  code = "INTERNAL_SERVER_ERROR",
  status = 500,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function formatValidationErrors(details: unknown): string {
  if (!details || typeof details !== "object") {
    return "Validation failed. Please verify the submitted data.";
  }

  const issues: string[] = [];

  const fieldErrors = (details as { fieldErrors?: Record<string, string[]> }).fieldErrors;
  const formErrors = (details as { formErrors?: string[] }).formErrors;

  if (fieldErrors && typeof fieldErrors === "object") {
    for (const [field, messages] of Object.entries(fieldErrors)) {
      if (Array.isArray(messages) && messages.length > 0) {
        const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
        issues.push(`${formattedField}: ${messages.join(", ")}`);
      }
    }
  }

  if (Array.isArray(formErrors) && formErrors.length > 0) {
    issues.push(...formErrors);
  }

  if (issues.length === 0) {
    for (const [key, val] of Object.entries(details)) {
      if (typeof val === "string") {
        const formattedField = key.charAt(0).toUpperCase() + key.slice(1);
        issues.push(`${formattedField}: ${val}`);
      }
    }
  }

  if (issues.length > 0) {
    return `Validation failed - required: ${issues.join("; ")}`;
  }

  return "Validation failed. Please verify the submitted data.";
}

export function apiValidationError(details: unknown): NextResponse<ApiErrorResponse> {
  const message = formatValidationErrors(details);
  return apiError(message, "VALIDATION_ERROR", 400, details);
}

export function apiNotFound(entityName = "Resource"): NextResponse<ApiErrorResponse> {
  return apiError(`${entityName} not found.`, "NOT_FOUND", 404);
}
