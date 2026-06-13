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

const RARITY_STYLE: Record<
  Rarity,
  { border: string; badgeBg: string; badgeColor: string; rankColor: string }
> = {
  N: { border: "#9aa0b4", badgeBg: "#3a3f52", badgeColor: "#cfd4e6", rankColor: "#cfd4e6" },
  R: { border: "#4FC3F7", badgeBg: "#103a52", badgeColor: "#4FC3F7", rankColor: "#7fd8ff" },
  SR: { border: "#B388FF", badgeBg: "#33205e", badgeColor: "#B388FF", rankColor: "#cdb1ff" },
  SSR: { border: "#FF2E97", badgeBg: "#FF2E97", badgeColor: "#ffffff", rankColor: "#ff7ab8" },
  UR: { border: "#FFD700", badgeBg: "#FFD700", badgeColor: "#6b4a00", rankColor: "#ffe45c" },
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
          background: "linear-gradient(165deg, #1d1040 0%, #0a0618 60%, #1a0f2e 100%)",
          border: `14px solid ${st.border}`,
          padding: "44px 60px",
          fontFamily: "ZenKaku",
          color: "#F4F0FF",
        }}
      >
        {/* ヘッダー */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              background: st.badgeBg,
              color: st.badgeColor,
              fontSize: 38,
              padding: "8px 34px",
              borderRadius: 999,
              letterSpacing: "0.15em",
            }}
          >
            {f.rarity}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#8E86B8", letterSpacing: "0.18em" }}>
            🗑️ ゴミ出し占い
          </div>
        </div>

        {/* 本文 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 30, color: "#00E5FF" }}>{f.dateLong}</div>
          <div style={{ display: "flex", fontSize: 24, color: "#8E86B8", marginTop: 6 }}>
            {areaText}
          </div>
          <div style={{ display: "flex", fontSize: 132, lineHeight: 1.1, color: st.rankColor, marginTop: 10 }}>
            {f.rank.t}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#8E86B8", letterSpacing: "0.1em" }}>
            ― {f.rank.s} ―
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#F4F0FF",
              marginTop: 26,
              padding: "10px 26px",
              borderRadius: 14,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            今日のゴミ：{gomiText}
          </div>
        </div>

        {/* フッター */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px dashed #4a4170",
            paddingTop: 20,
          }}
        >
          <div style={{ display: "flex", fontSize: 28, color: "#00E5FF" }}>
            decomoji.xyz/trash-day
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#8E86B8" }}>#ゴミ出し占い</div>
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
