import { NextResponse } from "next/server";
import { pingDatabaseKeepAlive } from "@/lib/keep-alive";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await pingDatabaseKeepAlive("api-cron-get");
  const statusCode = result.success ? 200 : 500;
  return NextResponse.json(result, { status: statusCode });
}

export async function POST() {
  const result = await pingDatabaseKeepAlive("api-cron-post");
  const statusCode = result.success ? 200 : 500;
  return NextResponse.json(result, { status: statusCode });
}
