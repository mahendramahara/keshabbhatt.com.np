import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a1b3f 0%, #040b1a 100%)",
          borderRadius: 7,
          border: "1.5px solid #f2c46d",
          color: "#f2c46d",
          fontSize: 16,
          fontWeight: 800,
          fontFamily: "serif",
          letterSpacing: "-0.5px",
        }}
      >
        KB
      </div>
    ),
    {
      ...size,
    }
  );
}
