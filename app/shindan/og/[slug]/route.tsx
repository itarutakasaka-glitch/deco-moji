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

const RARITY_STYLE: Record<
  Rarity,
  { border: string; badgeBg: string; badgeColor: string; powerColor: string }
> = {
  N: { border: "#9aa0b4", badgeBg: "#3a3f52", badgeColor: "#cfd4e6", powerColor: "#cfd4e6" },
  R: { border: "#4FC3F7", badgeBg: "#103a52", badgeColor: "#4FC3F7", powerColor: "#7fd8ff" },
  SR: { border: "#B388FF", badgeBg: "#33205e", badgeColor: "#B388FF", powerColor: "#cdb1ff" },
  SSR: { border: "#FF2E97", badgeBg: "#FF2E97", badgeColor: "#ffffff", powerColor: "#ff7ab8" },
  UR: { border: "#FFD700", badgeBg: "#FFD700", badgeColor: "#6b4a00", powerColor: "#ffe45c" },
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
          background: "linear-gradient(165deg, #1d1040 0%, #0a0618 60%, #1a0f2e 100%)",
          border: `14px solid ${st.border}`,
          padding: "48px 64px",
          fontFamily: "ZenKaku",
          color: "#F4F0FF",
        }}
      >
        {/* ヘッダー行 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              background: st.badgeBg,
              color: st.badgeColor,
              fontSize: 40,
              padding: "8px 36px",
              borderRadius: 999,
              letterSpacing: "0.15em",
            }}
          >
            {d.rarity}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#8E86B8", letterSpacing: "0.2em" }}>
            ⚡SNSパワー診断
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
          <div style={{ display: "flex", fontSize: 34, color: "#8E86B8" }}>{nameLine}</div>
          <div style={{ display: "flex", fontSize: 56, marginTop: 10 }}>{titleLine}</div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#8E86B8",
              letterSpacing: "0.35em",
              marginTop: 28,
            }}
          >
            — SNS戦闘力 —
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 150,
              lineHeight: 1.1,
              color: st.powerColor,
            }}
          >
            {powerText}
          </div>
        </div>

        {/* フッター */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px dashed #4a4170",
            paddingTop: 22,
          }}
        >
          <div style={{ display: "flex", fontSize: 30, color: "#00E5FF" }}>
            decomoji.xyz/shindan
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#8E86B8" }}>
            #SNSパワー診断
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
