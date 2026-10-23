import { NextResponse } from "next/server";
import { CvService } from "@/services";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cv = await CvService.getActiveCv();

    if (!cv || !cv.buffer) {
      return NextResponse.json(
        { success: false, message: "CV document not found." },
        { status: 404 }
      );
    }

    // Convert Buffer to Uint8Array for Next.js response body
    const body = new Uint8Array(cv.buffer);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": cv.mimeType || "application/pdf",
        "Content-Disposition": `inline; filename="${cv.filename}"`,
        "Content-Length": body.length.toString(),
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("GET /api/cv/download error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to load CV." },
      { status: 500 }
    );
  }
}
