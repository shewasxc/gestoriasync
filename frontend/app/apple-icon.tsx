import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#4F46E5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#FFFFFF",
              marginRight: -28,
            }}
          />
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.55)",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
