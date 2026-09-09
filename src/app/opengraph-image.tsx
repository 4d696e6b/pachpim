import { ImageResponse } from "next/og";

import { getPublicContent, siteIdentity } from "@/lib/server/public-content";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const { profile } = await getPublicContent();
  const identity = siteIdentity(profile);

  return new ImageResponse(
    <div
      style={{
        alignItems: "flex-start",
        background: "#0c100f",
        color: "#eef3f0",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "76px",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#5dd6b3",
          display: "flex",
          fontSize: 24,
          letterSpacing: "0.12em",
        }}
      >
        PORTFOLIO
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: "-0.05em",
          }}
        >
          {identity.name}
        </div>
        {identity.title ? (
          <div
            style={{
              color: "#9da9a4",
              display: "flex",
              fontSize: 34,
              marginTop: 18,
            }}
          >
            {identity.title}
          </div>
        ) : null}
      </div>
    </div>,
    size,
  );
}
