import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "診断・占いであそぶ｜名前やゴミの日でわかる無料の診断メーカー集",
  description:
    "デコ文字メーカーの診断・占いをまとめたページ。SNSパワー診断・デコ文字相性診断・ゴミ出し占いなど、名前を入れるだけ・丁目を選ぶだけで結果が出る無料コンテンツを集めました。結果はそのままXでシェアできます。",
  alternates: { canonical: "/play" },
  openGraph: {
    title: "診断・占いであそぶ｜無料の診断メーカー集",
    description:
      "名前やゴミの日でわかる無料の診断・占いまとめ。結果はXでシェアして遊べます。",
    url: "/play",
  },
  twitter: {
    card: "summary_large_image",
    title: "診断・占いであそぶ｜無料の診断メーカー集",
    description: "名前やゴミの日でわかる無料の診断・占いまとめ。",
  },
};

type PlayItem = {
  title: string;
  href: string;
  tag: string;
  desc: string;
  accent: string;
  badge?: string;
};

const C = {
  bg: "#f4f1ea",
  surface: "#ffffff",
  ink: "#2b2a27",
  sub: "#6f6a61",
  dim: "#a39c90",
  line: "#e4ded2",
};

// 診断・占いを足したらこの配列に追記
const ITEMS: PlayItem[] = [
  {
    title: "SNSパワー診断",
    href: "/shindan",
    tag: "診断",
    desc: "名前を入れるだけ。あなたのSNS戦闘力とレアリティ（N〜UR）・称号を測定。",
    accent: "#7fa3b5",
    badge: "人気",
  },
  {
    title: "デコ文字相性診断",
    href: "/compatibility",
    tag: "診断",
    desc: "ふたりの名前で相性スコアを診断。そのまま貼れるデコ文字メッセージ付き。",
    accent: "#c98aa0",
    badge: "NEW",
  },
  {
    title: "ゴミ出し占い",
    href: "/trash-day",
    tag: "占い",
    desc: "目黒区のゴミの日を丁目で調べて、今日の“正しいゴミの出し方（開運作法）”を占う。",
    accent: "#c2a24e",
  },
];

const COMING: string[] = ["推しメンカラ診断", "今日のラッキーデコ文字"];

export default function PlayIndexPage() {
  return (
    <div
      style={{
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        minHeight: "100svh",
        background: C.bg,
        color: C.ink,
        fontFamily: '"Zen Kaku Gothic New", sans-serif',
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 28px 16px" }}>
        <div style={{ fontSize: "0.72rem", letterSpacing: "0.3em", textTransform: "uppercase", color: C.dim, marginBottom: 16 }}>
          decomoji ・ diagnosis & fortune
        </div>
        <h1 style={{ fontWeight: 900, fontSize: "clamp(2rem, 7vw, 2.8rem)", lineHeight: 1.22, margin: 0 }}>
          診断・占いであそぶ
        </h1>
        <p style={{ color: C.sub, fontSize: "0.95rem", lineHeight: 1.95, margin: "14px 0 0", paddingBottom: 26, borderBottom: `1px solid ${C.line}` }}>
          デコ文字メーカーの<b style={{ color: C.ink }}>診断・占い</b>をまとめました。どれも無料・登録不要で、
          結果はそのままXでシェアできます。プロフを盛りたくなったら
          <Link href="/" style={{ color: C.ink, textDecoration: "underline" }}>デコ文字メーカー</Link>へ。
        </p>

        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", margin: "30px 0 36px" }}>
          {ITEMS.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              style={{
                display: "block",
                background: C.surface,
                border: `1px solid ${C.line}`,
                borderTop: `4px solid ${it.accent}`,
                borderRadius: 4,
                padding: "22px 22px 20px",
                textDecoration: "none",
                color: C.ink,
                boxShadow: "0 16px 44px -30px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", background: it.accent, padding: "3px 9px", borderRadius: 2 }}>
                  {it.tag}
                </span>
                {it.badge && (
                  <span style={{ fontSize: "0.62rem", letterSpacing: "0.14em", color: C.sub, border: `1px solid ${C.line}`, padding: "3px 9px", borderRadius: 2 }}>
                    {it.badge}
                  </span>
                )}
              </div>
              <div style={{ fontWeight: 900, fontSize: "1.2rem", marginBottom: 8 }}>{it.title}</div>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.8, color: C.sub, margin: 0 }}>{it.desc}</p>
              <div style={{ marginTop: 14, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", color: C.ink }}>
                あそんでみる →
              </div>
            </Link>
          ))}
        </div>

        <AdSlot />

        <div style={{ margin: "28px 0 36px" }}>
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.dim, marginBottom: 12 }}>
            近日公開予定
          </div>
          <div style={{ display: "grid", gap: 0, borderTop: `1px solid ${C.line}` }}>
            {COMING.map((c) => (
              <div key={c} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 2px", borderBottom: `1px solid ${C.line}`, color: C.sub, fontSize: "0.9rem", fontWeight: 700 }}>
                {c}
                <span style={{ fontWeight: 400, color: C.dim, fontSize: "0.78rem" }}>準備中…</span>
              </div>
            ))}
          </div>
        </div>

        <section style={{ paddingBottom: 8 }}>
          <h2 style={{ fontWeight: 900, fontSize: "1.12rem", margin: "0 0 12px", paddingBottom: 10, borderBottom: `1px solid ${C.line}` }}>
            診断・占いについて
          </h2>
          <p style={{ color: C.sub, fontSize: "0.92rem", lineHeight: 2, margin: 0 }}>
            ここにある診断・占いは、入力（名前や日付・地域）から決定論的に結果を計算する
            「おみくじ」型のエンターテインメントです。同じ入力なら何度試しても同じ結果になります。
            名前を使う診断でも、入力内容はブラウザの中だけで処理され、サーバーに保存されません。
            結果ページにはシェア用の画像（OGP）が自動生成されるので、Xに貼ると見栄えよく拡散できます。
          </p>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
