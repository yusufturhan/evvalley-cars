/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Evvalley - US EV & E-Mobility Marketplace";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(90deg, #3AB0FF 0%, #78D64B 100%)",
          padding: 48,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 48,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#0B1025",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            ⚡
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#0B1025",
              letterSpacing: -0.5,
            }}
          >
            EVVALLEY
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 24,
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.1,
              textShadow: "0 2px 12px rgba(0,0,0,0.18)",
            }}
          >
            Find Your Perfect Electric Vehicle
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#F2F6FF",
              fontWeight: 500,
              textShadow: "0 1px 8px rgba(0,0,0,0.18)",
            }}
          >
            US Electric Vehicle & E‑Mobility Marketplace
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: 48,
            fontSize: 28,
            color: "#0B1025",
            fontWeight: 700,
            background: "rgba(255,255,255,0.8)",
            padding: "8px 14px",
            borderRadius: 10,
          }}
        >
          evvalley.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}


