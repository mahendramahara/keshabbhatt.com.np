import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a1b3f 0%, #07132b 50%, #040b1a 100%)",
          borderRadius: 36,
          border: "4px solid #f2c46d",
          color: "#f2c46d",
          fontFamily: "serif",
        }}
      >
        <span
          style={{
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          KB
        </span>
        <div
          style={{
            marginTop: 8,
            width: 50,
            height: 3,
            backgroundColor: "#f2c46d",
            borderRadius: 2,
            opacity: 0.8,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
