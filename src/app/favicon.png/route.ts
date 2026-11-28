import { createElement } from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export async function GET() {
  const mark = createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        borderRadius: 42,
        background: "#ffffff",
      },
    },
    createElement("div", {
      style: {
        position: "absolute",
        width: 148,
        height: 148,
        borderRadius: 74,
        background: "#f1f7ff",
      },
    }),
    createElement(
      "div",
      {
        style: {
          position: "absolute",
          left: 43,
          top: 35,
          fontSize: 115,
          lineHeight: 1,
          fontWeight: 800,
          fontFamily: "Arial",
          color: "#2876d8",
        },
      },
      "F",
    ),
    createElement(
      "div",
      {
        style: {
          position: "absolute",
          right: 28,
          bottom: 21,
          fontSize: 105,
          lineHeight: 1,
          fontWeight: 800,
          fontFamily: "Arial",
          color: "#6757d9",
        },
      },
      "S",
    ),
    createElement("div", {
      style: {
        position: "absolute",
        width: 13,
        height: 13,
        borderRadius: 7,
        right: 28,
        top: 27,
        background: "#42b9df",
      },
    }),
  );

  return new ImageResponse(mark, { ...size });
}
