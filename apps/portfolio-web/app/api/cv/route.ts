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

    const body = new Uint8Array(cv.buffer);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": cv.mimeType || "application/pdf",
        "Content-Disposition": `attachment; filename="${cv.filename}"`,
        "Content-Length": body.length.toString(),
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    });
  } catch (error) {
    console.error("Error serving CV file:", error);
    return new NextResponse("Failed to download CV", { status: 500 });
  }
}

