import { NextRequest, NextResponse } from "next/server";
import { CvService } from "@/services";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cv = await CvService.getCvById(id);

    if (!cv || !cv.buffer) {
      return NextResponse.json(
        { success: false, message: "CV not found." },
        { status: 404 }
      );
    }

    const body = new Uint8Array(cv.buffer);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": cv.mimeType || "application/pdf",
        "Content-Disposition": `inline; filename="${cv.filename}"`,
        "Content-Length": body.length.toString(),
      },
    });
  } catch (err) {
    console.error("GET /api/cv/[id] error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve CV." },
      { status: 500 }
    );
  }
}
