import { connectDatabase } from "@/config/database";

let isSchedulerRunning = false;
const PING_INTERVAL_MS = 1000 * 60 * 60 * 24;

export async function pingDatabaseKeepAlive(source = "internal-scheduler"): Promise<{
  success: boolean;
  timestamp: string;
  message: string;
}> {
  const timestamp = new Date().toISOString();
  try {
    const mongoose = await connectDatabase();
    const isConnected = mongoose.connection.readyState === 1;

    return {
      success: isConnected,
      timestamp,
      message: isConnected
        ? `MongoDB database connected and healthy (Source: ${source}).`
        : `MongoDB connection state: ${mongoose.connection.readyState}`,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown keep-alive error";
    console.error("[KeepAlive Error]:", errorMsg);
    return {
      success: false,
      timestamp,
      message: `Keep-alive ping failed: ${errorMsg}`,
    };
  }
}

export function startKeepAliveScheduler(): void {
  if (
    typeof window !== "undefined" ||
    isSchedulerRunning ||
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.VERCEL === "1"
  ) {
    return;
  }

  isSchedulerRunning = true;
  setTimeout(() => {
    pingDatabaseKeepAlive("server-startup").catch(() => {});
  }, 10000);

  setInterval(() => {
    pingDatabaseKeepAlive("scheduled-24h").catch(() => {});
  }, PING_INTERVAL_MS);
}
