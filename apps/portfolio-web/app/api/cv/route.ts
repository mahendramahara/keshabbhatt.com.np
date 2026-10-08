import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET() {
  try {
    const candidatePaths = [
      path.join(process.cwd(), "public", "cv", "keshabbhatt.com.np.pdf"),
      path.join(process.cwd(), "apps", "portfolio-web", "public", "cv", "keshabbhatt.com.np.pdf"),
      path.resolve(process.cwd(), "public/cv/keshabbhatt.com.np.pdf"),
      path.resolve(process.cwd(), "apps/portfolio-web/public/cv/keshabbhatt.com.np.pdf"),
      path.join(process.cwd(), "public", "cv", "keshab-datt-bhatt-cv.pdf"),
      path.join(process.cwd(), "apps", "portfolio-web", "public", "cv", "keshab-datt-bhatt-cv.pdf"),
    ];

    const filePath = candidatePaths.find((p) => fs.existsSync(p));
    if (!filePath) {
      return NextResponse.redirect(
        new URL("/cv/keshabbhatt.com.np.pdf", process.env.NEXT_PUBLIC_SITE_URL || "https://keshabbhatt.com.np")
      );
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="keshabbhatt.com.np.pdf"',
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error serving CV file:", error);
    return new NextResponse("Failed to download CV", { status: 500 });
  }
}
