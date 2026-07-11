import { ImageResponse } from "next/og";
import {
  buildFortune,
  decodeSlug,
  DEFAULT_CHOME_INDEX,
  labelFor,
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

// 目黒区公式サイト風：紫基調の識別カラー
const RARITY_STYLE: Record<Rarity, { accent: string }> = {
  N: { accent: "#8a8a8a" },
  R: { accent: "#5a63b0" },
  SR: { accent: "#7f4098" },
  SSR: { accent: "#b0578d" },
  UR: { accent: "#b08c3e" },
};
const THEME = "#7f4098";
const THEME_D = "#63307a";

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
    ? f.today.map((k) => labelFor(f.chomeIndex, k)).join("・")
    : "今日は収集なし";

  const areaText = `${f.muni}・${f.area}`;
  const allText =
    "ゴミ出し占い 目黒区 品川区 東京 今日のゴミ 運勢 開運作法 収集なし ごみ収集日カレンダーのを丁目で検索 decomoji.xyz/trash-day #年月日()・/0123456789NRSU" +
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
          background: "#ffffff",
          borderTop: `18px solid ${THEME}`,
          padding: "48px 70px 40px",
          fontFamily: "ZenKaku",
          color: "#1f2937",
        }}
      >
        {/* ヘッダー */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #c9d3de", paddingBottom: 20 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: THEME_D }}>
            {f.muni} ごみ収集日カレンダー
          </div>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#fff", background: st.accent, padding: "4px 18px", borderRadius: 4 }}>
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
          <div style={{ display: "flex", fontSize: 28, color: "#475569", fontWeight: 700 }}>
            {f.dateLong}　{areaText}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#6b7280", marginTop: 26 }}>今日のゴミ出し占い</div>
          <div style={{ display: "flex", fontSize: 112, lineHeight: 1.1, fontWeight: 700, color: THEME_D, marginTop: 4 }}>
            {f.rank.t}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#475569", marginTop: 8, fontWeight: 700 }}>
            {f.rank.s}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#1f2937", marginTop: 28, padding: "16px 22px", background: "#f4f7fb", border: "1px solid #c9d3de", borderRadius: 4 }}>
            今日のゴミ：{gomiText}
          </div>
        </div>

        {/* フッター */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #c9d3de",
            paddingTop: 20,
            fontSize: 24,
            color: "#6b7280",
          }}
        >
          <div style={{ display: "flex" }}>decomoji.xyz/trash-day</div>
          <div style={{ display: "flex" }}>{f.muni}のゴミ収集日を丁目で検索</div>
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
