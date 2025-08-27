import { ImageResponse } from "next/og";

export const runtime = "edge";
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
            fontSize: 68,
            fontWeight: 900,
            color: "#FFFFFF",
            lineHeight: 1.1,
            textShadow: "0 2px 12px rgba(0,0,0,0.18)",
          }}
        >
          Evvalley — US EV & E‑Mobility Marketplace
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 30,
            color: "#F2F6FF",
            fontWeight: 600,
          }}
        >
          Find Your Perfect Electric Vehicle
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}


