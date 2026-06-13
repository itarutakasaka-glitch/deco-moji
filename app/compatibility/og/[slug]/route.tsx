import { ImageResponse } from "next/og";
import { diagnoseCompat, decodeSlug, type Tier } from "@/lib/compatibility-core";

export const runtime = "edge";

async function loadGoogleFont(text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@900&text=${encodeURIComponent(
    text
  )}`;
  const css = await (
    await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1; rv:10.0) Gecko/20100101 Firefox/10.0",
      },
    })
  ).text();
  const match = css.match(
    /src: url\((.+?)\) format\('(?:truetype|opentype|woff)'\)/
  );
  if (!match) throw new Error("font css parse failed");
  return await (await fetch(match[1])).arrayBuffer();
}

const TIER_STYLE: Record<Tier, { border: string; score: string }> = {
  destiny: { border: "#FFD700", score: "#ffe45c" },
  love: { border: "#FF2E97", score: "#ff7ab8" },
  good: { border: "#FF5CA0", score: "#ff9cc4" },
  growing: { border: "#7AD7FF", score: "#aee6ff" },
  trial: { border: "#C79BB4", score: "#e0c4d4" },
  training: { border: "#9a8aa0", score: "#c9bcd0" },
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const decoded = decodeSlug(slug);
  const d = decoded
    ? diagnoseCompat(decoded.a, decoded.b)
    : diagnoseCompat("れい", "ゆう");
  const st = TIER_STYLE[d.tier];

  const namesLine = `${d.nameA}  ×  ${d.nameB}`;
  const allText =
    "デコ文字相性診断 相性 タイプ decomoji.xyz/compatibility #×%0123456789" +
    namesLine +
    d.tierLabel +
    d.tierEmoji +
    d.comment;

  const font = await loadGoogleFont(allText);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(165deg, #3a0d2a 0%, #1a0612 60%, #2a0a22 100%)",
          border: `14px solid ${st.border}`,
          padding: "44px 60px",
          fontFamily: "ZenKaku",
          color: "#fff0f6",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", fontSize: 30, color: "#c79bb4", letterSpacing: "0.18em" }}>
          💞 デコ文字相性診断
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 52, marginBottom: 4 }}>{namesLine}</div>
          <div style={{ display: "flex", alignItems: "flex-end", color: st.score }}>
            <div style={{ display: "flex", fontSize: 190, lineHeight: 1 }}>{d.score}</div>
            <div style={{ display: "flex", fontSize: 70, paddingBottom: 24 }}>%</div>
          </div>
          <div style={{ display: "flex", fontSize: 48, color: "#ffd700", marginTop: 4 }}>
            {d.tierEmoji} {d.tierLabel}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px dashed #6a4a5e",
            paddingTop: 20,
          }}
        >
          <div style={{ display: "flex", fontSize: 28, color: "#ff9cc4" }}>
            decomoji.xyz/compatibility
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#c79bb4" }}>
            #デコ文字相性診断
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "ZenKaku", data: font, weight: 900, style: "normal" }],
    }
  );
}
