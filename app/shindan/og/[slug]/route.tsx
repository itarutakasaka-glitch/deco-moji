import { ImageResponse } from "next/og";
import {
  decodeSlug,
  diagnose,
  SNS_LABEL,
  type Rarity,
} from "@/lib/shindan-core";

export const runtime = "edge";

// 使用グリフだけサブセットした TTF を Google Fonts から取得（日本語フルフォントは重すぎるため）
async function loadGoogleFont(text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@900&text=${encodeURIComponent(
    text
  )}`;
  const css = await (
    await fetch(url, {
      headers: {
        // 古いUAを名乗ると woff2 ではなく TTF が返る（satori は TTF/OTF のみ対応）
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1; rv:10.0) Gecko/20100101 Firefox/10.0",
      },
    })
  ).text();
  // 旧UA指定でも woff で返ることがある（satori は TTF/OTF/WOFF 対応、WOFF2 のみ非対応）
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
  const d = decoded
    ? diagnose(decoded.name, decoded.sns)
    : diagnose("ゲスト", "x");
  const st = RARITY_STYLE[d.rarity];

  const powerText = d.power.toLocaleString();
  const nameLine = `@ ${d.name}（${SNS_LABEL[d.sns]}）`;
  const titleLine = `「${d.plainTitle}」`;
  const allText =
    "SNSパワー診断 戦闘力 称号 decomoji.xyz/shindan #NRSU0123456789,@（）XInstagramTikTok ゲスト" +
    nameLine +
    titleLine +
    powerText +
    d.rarity;

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
        {/* ヘッダー行 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#a39c90", letterSpacing: "0.28em" }}>
            SNSパワー診断 ・ SNS POWER
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 900, color: st.accent }}>
            {d.rarity}
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
          <div style={{ display: "flex", fontSize: 30, color: "#6f6a61" }}>{nameLine}</div>
          <div style={{ display: "flex", fontSize: 54, fontWeight: 900, marginTop: 8 }}>{titleLine}</div>
          <div style={{ display: "flex", fontSize: 24, color: "#a39c90", letterSpacing: "0.28em", marginTop: 30 }}>
            SNS戦闘力
          </div>
          <div style={{ display: "flex", fontSize: 150, lineHeight: 1.0, fontWeight: 900, color: "#2b2a27", letterSpacing: "-0.02em" }}>
            {powerText}
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
          <div style={{ display: "flex" }}>decomoji.xyz/shindan</div>
          <div style={{ display: "flex" }}>#SNSパワー診断</div>
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
