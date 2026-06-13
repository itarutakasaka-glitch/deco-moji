import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "診断・占いであそぶ｜名前やゴミの日でわかる無料の診断メーカー集",
  description:
    "デコ文字メーカーの診断・占いをまとめたページ。SNSパワー診断やゴミ出し占いなど、名前を入れるだけ・丁目を選ぶだけで結果が出る無料コンテンツを集めました。結果はそのままXでシェアできます。",
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
  emoji: string;
  href: string;
  tag: string;
  desc: string;
  accent: string; // カード上部のアクセント帯（グラデーション）
  badge?: string;
};

// ここに増やすほどポータルが充実する（診断・占いを足したらこの配列に追記）
const ITEMS: PlayItem[] = [
  {
    title: "SNSパワー診断",
    emoji: "⚡",
    href: "/shindan",
    tag: "診断",
    desc: "名前を入れるだけ。あなたのSNS戦闘力とレアリティ（N〜UR）・称号を測定。",
    accent: "linear-gradient(135deg, #FF2E97, #9D4EDD 60%, #00E5FF)",
    badge: "人気",
  },
  {
    title: "ゴミ出し占い",
    emoji: "🗑️",
    href: "/trash-day",
    tag: "占い",
    desc: "目黒区のゴミの日を丁目で調べて、今日の“正しいゴミの出し方（開運作法）”を占う。",
    accent: "linear-gradient(135deg, #0a0618, #1d1040 55%, #00E5FF)",
    badge: "NEW",
  },
];

const COMING: { title: string; emoji: string }[] = [
  { title: "推しメンカラ診断", emoji: "🎤" },
  { title: "デコ文字相性診断", emoji: "💞" },
];

export default function PlayIndexPage() {
  return (
    <>
      <SiteHeader
        title="診断・占いであそぶ"
        tagline="名前やゴミの日でわかる、無料の診断メーカー集"
      />

      <div
        className="rounded-2xl bg-white px-5 py-4 mb-6 text-[0.95rem] leading-relaxed"
        style={{ border: "2px solid var(--color-ink)" }}
      >
        デコ文字メーカーの<b>診断・占い</b>をまとめました。どれも無料・登録不要で、
        結果はそのままXでシェアできます。自分のプロフを盛りたくなったら
        <Link href="/" className="underline">
          デコ文字メーカー
        </Link>
        へ。
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        {ITEMS.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="block rounded-2xl bg-white overflow-hidden transition hover:-translate-y-1"
            style={{ border: "2px solid var(--color-ink)" }}
          >
            <div style={{ height: 8, background: it.accent }} />
            <div className="px-5 py-5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-2xl">{it.emoji}</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: "var(--color-pink-4)" }}
                >
                  {it.title}
                </span>
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    color: "#fff",
                    background: "var(--color-pink-4)",
                  }}
                >
                  {it.tag}
                </span>
                {it.badge && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ color: "#6b4a00", background: "#FFD700" }}
                  >
                    {it.badge}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{it.desc}</p>
              <div
                className="mt-3 text-sm font-bold"
                style={{ color: "var(--color-pink-3)" }}
              >
                あそんでみる →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <AdSlot />

      <div className="mb-8">
        <p
          className="mb-3 text-sm font-bold"
          style={{ color: "var(--color-pink-4)" }}
        >
          ⊹ 近日公開予定
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {COMING.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl px-5 py-4 text-sm font-bold opacity-70"
              style={{
                border: "2px dashed var(--color-lav-2)",
                color: "var(--color-pink-4)",
                background: "rgba(255,255,255,0.5)",
              }}
            >
              {c.emoji} {c.title}
              <span className="ml-2 font-normal text-gray-500">準備中…</span>
            </div>
          ))}
        </div>
      </div>

      <section className="rounded-2xl bg-white px-5 py-5 mb-8 text-[0.92rem] leading-relaxed text-gray-700" style={{ border: "2px solid var(--color-ink)" }}>
        <h2 className="text-base font-bold mb-2" style={{ color: "var(--color-pink-4)" }}>
          診断・占いについて
        </h2>
        <p>
          ここにある診断・占いは、入力（名前や日付・地域）から決定論的に結果を計算する
          「おみくじ」型のエンターテインメントです。同じ入力なら何度試しても同じ結果になります。
          名前を使う診断でも、入力内容はブラウザの中だけで処理され、サーバーに保存されません。
          結果ページにはシェア用の画像（OGP）が自動生成されるので、Xに貼ると見栄えよく拡散できます。
        </p>
      </section>

      <SiteFooter />
    </>
  );
}
