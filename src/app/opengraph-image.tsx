import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Veil: find the sunscreen that disappears on your skin.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "public/replay/elder/swiped.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#f6f3ee" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700, padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 600, color: "#1b1f24" }}>
          <div style={{ display: "flex", width: 30, height: 30, borderRadius: 15, border: "2px solid #1b1f24", justifyContent: "center" }}>
            <div style={{ width: 3, height: 30, background: "#d4502f" }} />
          </div>
          Veil
        </div>
        <div style={{ display: "flex", fontSize: 78, lineHeight: 1, letterSpacing: -3, fontWeight: 600, color: "#1b1f24" }}>
          Find the sunscreen that disappears on your skin.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#5d636b" }}>Swipe one cheek. Veil measures the white cast.</div>
      </div>
      <div style={{ display: "flex", position: "relative", width: 500, height: 630 }}>
        <img src={src} width={500} height={630} style={{ objectFit: "cover" }} alt="" />
        <div style={{ position: "absolute", left: 205, top: 40, width: 4, height: 560, background: "#d4502f", borderRadius: 2 }} />
      </div>
    </div>,
    size,
  );
}
