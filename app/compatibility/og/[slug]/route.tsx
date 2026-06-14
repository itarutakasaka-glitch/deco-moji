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

// JARTAN調：くすみアクセント
const TIER_STYLE: Record<Tier, { accent: string }> = {
  destiny: { accent: "#c2a24e" },
  love: { accent: "#c98aa0" },
  good: { accent: "#a98ca6" },
  growing: { accent: "#9bbf93" },
  trial: { accent: "#93bdb6" },
  training: { accent: "#b3a899" },
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
          background: "#f4f1ea",
          borderTop: `16px solid ${st.accent}`,
          padding: "54px 70px 44px",
          fontFamily: "ZenKaku",
          color: "#2b2a27",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#a39c90", letterSpacing: "0.28em" }}>
          デコ文字相性診断 ・ COMPATIBILITY
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 56, fontWeight: 900, marginBottom: 18 }}>{namesLine}</div>
          <div style={{ display: "flex", alignItems: "flex-end", color: "#2b2a27" }}>
            <div style={{ display: "flex", fontSize: 230, lineHeight: 0.9, fontWeight: 900, letterSpacing: "-0.02em" }}>{d.score}</div>
            <div style={{ display: "flex", fontSize: 64, paddingBottom: 34, color: "#6f6a61" }}>%</div>
          </div>
          <div style={{ display: "flex", width: 540, height: 8, background: "#e4ded2", marginTop: 6 }}>
            <div style={{ display: "flex", width: (540 * d.score) / 100, height: 8, background: st.accent }} />
          </div>
          <div style={{ display: "flex", fontSize: 50, fontWeight: 900, marginTop: 22 }}>
            {d.tierLabel}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #d8d1c4",
            paddingTop: 22,
            fontSize: 24,
            color: "#a39c90",
            letterSpacing: "0.12em",
          }}
        >
          <div style={{ display: "flex" }}>decomoji.xyz/compatibility</div>
          <div style={{ display: "flex" }}>#デコ文字相性診断</div>
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
