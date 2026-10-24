import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDatabase, resolveMongoUri } from "@/config/database";
import { BlogModel, BlogCategoryModel } from "@/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const rawUri = process.env.MONGODB_URI || "";
  const resolvedUri = resolveMongoUri(rawUri);

  // Mask credentials for safe display
  const maskedRaw = rawUri
    ? rawUri.replace(/:([^@]+)@/, ":****@")
    : "NOT_SET (falling back to default)";
  const maskedResolved = resolvedUri
    ? resolvedUri.replace(/:([^@]+)@/, ":****@")
    : "NOT_SET";

  try {
    const mongoInstance = await connectDatabase();
    const isConnected = mongoose.connection.readyState === 1;

    let totalBlogs = 0;
    let publishedBlogs = 0;
    let categoryCount = 0;
    let dbName = mongoose.connection.db?.databaseName || "unknown";

    if (isConnected) {
      [totalBlogs, publishedBlogs, categoryCount] = await Promise.all([
        BlogModel.countDocuments(),
        BlogModel.countDocuments({ isPublished: true }),
        BlogCategoryModel.countDocuments(),
      ]);
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      status: isConnected ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      durationMs,
      database: {
        connected: isConnected,
        readyState: mongoose.connection.readyState,
        databaseName: dbName,
        totalBlogs,
        publishedBlogs,
        categoryCount,
      },
      diagnostics: {
        rawUriMasked: maskedRaw,
        resolvedUriMasked: maskedResolved,
        envVarsConfigured: {
          MONGODB_URI: Boolean(process.env.MONGODB_URI),
          JWT_SECRET: Boolean(process.env.JWT_SECRET),
          SUPERADMIN_USERNAME: Boolean(process.env.SUPERADMIN_USERNAME),
        },
      },
      message:
        totalBlogs > 0
          ? "MongoDB connected and articles are present."
          : "MongoDB connected, but 0 articles found. Ensure target database is 'portfolio_db'.",
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        durationMs,
        database: {
          connected: false,
          readyState: mongoose.connection.readyState,
          error: errorMessage,
        },
        diagnostics: {
          rawUriMasked: maskedRaw,
          resolvedUriMasked: maskedResolved,
          envVarsConfigured: {
            MONGODB_URI: Boolean(process.env.MONGODB_URI),
            JWT_SECRET: Boolean(process.env.JWT_SECRET),
          },
        },
        message: "Failed to connect to MongoDB Atlas. Check credentials and Atlas IP whitelist.",
      },
      { status: 500 }
    );
  }
}
