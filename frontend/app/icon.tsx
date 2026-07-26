import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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
          background: "#4F46E5",
          borderRadius: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: "#FFFFFF",
              marginRight: -5,
            }}
          />
          <div
            style={{
              width: 13,
              height: 13,
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
