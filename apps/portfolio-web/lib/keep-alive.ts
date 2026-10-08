import prisma from "./prisma";

let isSchedulerRunning = false;
const PING_INTERVAL_MS = 1000 * 60 * 60 * 24; // Supabase free tier pauses inactive projects

export async function pingDatabaseKeepAlive(source = "internal-scheduler"): Promise<{
  success: boolean;
  timestamp: string;
  message: string;
}> {
  const timestamp = new Date().toISOString();
  try {
    await prisma.$queryRaw`SELECT 1`;

    await prisma.systemKeepAlive.create({
      data: {
        source,
        status: "alive",
      },
    });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await prisma.systemKeepAlive.deleteMany({
      where: {
        pingedAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    return {
      success: true,
      timestamp,
      message: "Supabase database successfully pinged and kept active.",
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
