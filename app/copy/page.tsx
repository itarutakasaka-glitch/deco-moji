import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { COPY_CATEGORIES } from "@/lib/copy-data";

export const metadata: Metadata = {
  title: "特殊文字コピペ素材集｜推し活・かわいいフレーム・区切り線をタップでコピー",
  description:
    "SNSプロフィールで使える特殊文字のコピペ素材をカテゴリ別にまとめました。推し活・かわいいフレーム・区切り線・誕生日仕様など、すべてタップでコピーしてそのまま貼れます。",
  alternates: { canonical: "/copy" },
  openGraph: {
    title: "特殊文字コピペ素材集｜タップでコピーしてそのまま使える",
    description: "推し活・かわいいフレーム・区切り線・誕生日。カテゴリ別のコピペ素材集。",
    url: "/copy",
  },
};

export default function CopyIndexPage() {
  return (
    <>
      <SiteHeader
        title="コピペ素材集"
        tagline="タップでコピーして、そのまま貼るだけ"
      />

      <div
        className="rounded-2xl bg-white px-5 py-4 mb-6 text-[0.95rem] leading-relaxed"
        style={{ border: "2px solid var(--color-ink)" }}
      >
        使う場面から選べる、特殊文字のコピペ素材集です。全部タップ（クリック）でコピーできます。
        自分で一から作りたいときは<Link href="/" className="underline">デコ文字メーカー</Link>へ。
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        {COPY_CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/copy/${c.slug}`}
            className="block rounded-2xl bg-white px-5 py-5 transition hover:-translate-y-1"
            style={{ border: "2px solid var(--color-ink)" }}
          >
            <p className="font-bold text-lg mb-1">{c.h1}</p>
            <p className="text-sm mb-2" style={{ color: "var(--color-pink-4)" }}>
              {c.tagline}
            </p>
            <p className="text-sm truncate" style={{ color: "#A66B80" }}>
              {c.groups[0].items.slice(0, 2).join("　")}
            </p>
          </Link>
        ))}
      </div>

      <div
        className="rounded-2xl bg-white px-5 py-4 mb-6 text-sm text-center"
        style={{ border: "2px solid var(--color-ink)", color: "var(--color-pink-4)" }}
      >
        カテゴリは順次追加中。「こんな素材がほしい」は
        <Link href="/contact" className="underline mx-1">お問い合わせ</Link>から
      </div>

      <SiteFooter />
    </>
  );
}
