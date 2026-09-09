import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0c100f",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#5dd6b3",
            display: "flex",
            fontSize: 110,
            fontWeight: 700,
            letterSpacing: "-0.06em",
            lineHeight: 1,
            marginTop: -8,
          }}
        >
          P
        </div>
      </div>
    ),
    size,
  );
}
