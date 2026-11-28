import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          borderRadius: 42,
          background: "#ffffff",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 148,
            height: 148,
            borderRadius: 74,
            background: "#f1f7ff",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 43,
            top: 35,
            fontSize: 115,
            lineHeight: 1,
            fontWeight: 800,
            fontFamily: "Arial",
            color: "#2876d8",
          }}
        >
          F
        </div>
        <div
          style={{
            position: "absolute",
            right: 28,
            bottom: 21,
            fontSize: 105,
            lineHeight: 1,
            fontWeight: 800,
            fontFamily: "Arial",
            color: "#6757d9",
          }}
        >
          S
        </div>
        <div
          style={{
            position: "absolute",
            width: 13,
            height: 13,
            borderRadius: 7,
            right: 28,
            top: 27,
            background: "#42b9df",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
