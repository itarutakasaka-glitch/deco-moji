import { ImageResponse } from "next/og";
import {
  buildFortune,
  decodeSlug,
  DEFAULT_CHOME_INDEX,
  TYPES,
  type Rarity,
} from "@/lib/gomi/core";

export const runtime = "edge";

// 使用グリフだけサブセットした TTF を Google Fonts から取得（日本語フルフォントは重すぎるため）
async function loadGoogleFont(text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@900&text=${encodeURIComponent(
    text
  )}`;
  const css = await (
    await fetch(url, {
      headers: {
        // 古いUAを名乗ると woff2 ではなく TTF/WOFF が返る（satori は WOFF2 非対応）
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
const RARITY_STYLE: Record<Rarity, { accent: string }> = {
  N: { accent: "#b3a899" },
  R: { accent: "#7fa3b5" },
  SR: { accent: "#a98ca6" },
  SSR: { accent: "#c98aa0" },
  UR: { accent: "#c2a24e" },
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const decoded = decodeSlug(slug);
  // 不正slugは固定の見本（上目黒四丁目・見本日）に（フォントサブセットを安定させる）
  const f = decoded
    ? buildFortune(decoded.chomeIndex, decoded.parts)
    : buildFortune(DEFAULT_CHOME_INDEX, { y: 2026, m: 6, d: 10 });
  const st = RARITY_STYLE[f.rarity];

  const gomiText = f.today.length
    ? f.today.map((k) => TYPES[k].label).join("・")
    : "今日は収集なし";

  const areaText = `目黒区・${f.area}`;
  const allText =
    "ゴミ出し占い 目黒区 今日のゴミ 運勢 開運作法 収集なし decomoji.xyz/trash-day #年月日()・/0123456789NRSU" +
    areaText +
    f.dateLong +
    f.rank.t +
    f.rank.s +
    gomiText;

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
        {/* ヘッダー */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#a39c90", letterSpacing: "0.28em" }}>
            ゴミ出し占い ・ GOMI FORTUNE
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 900, color: st.accent }}>
            {f.rarity}
          </div>
        </div>

        {/* 本文 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, color: "#6f6a61" }}>
            {f.dateLong}　{areaText}
          </div>
          <div style={{ display: "flex", fontSize: 124, lineHeight: 1.05, fontWeight: 900, color: "#2b2a27", marginTop: 8 }}>
            {f.rank.t}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: st.accent, letterSpacing: "0.1em", marginTop: 6 }}>
            {f.rank.s}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#2b2a27", marginTop: 30, paddingTop: 22, borderTop: "1px solid #e0d9cc", width: "100%" }}>
            今日のゴミ：{gomiText}
          </div>
        </div>

        {/* フッター */}
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
          <div style={{ display: "flex" }}>decomoji.xyz/trash-day</div>
          <div style={{ display: "flex" }}>#ゴミ出し占い</div>
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
