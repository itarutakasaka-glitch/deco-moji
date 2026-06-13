import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buildFortune, decodeSlug, TYPES } from "@/lib/gomi/core";
import FortuneCard from "@/components/FortuneCard";
import "../../trash-day.css";

type Props = { params: Promise<{ slug: string }> };

// 日付ごとに無限に生成されうるので noindex（薄いページの量産を防ぐ）
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = decodeSlug(slug);
  if (!p) return { robots: { index: false, follow: true } };
  const f = buildFortune(p);
  const ts = f.today.length
    ? f.today.map((k) => TYPES[k].label).join("・")
    : "収集なし";
  const title = `${f.dateLong} の運勢は【${f.rank.t}】｜ゴミ出し占い`;
  const description = `${f.area}・${ts}。${f.rank.s}。今日の開運作法をチェック🗑️✨`;
  const ogImage = `/trash-day/og/${slug}`;
  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: "/trash-day" },
    openGraph: {
      title,
      description,
      url: `/trash-day/r/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function TrashDayResultPage({ params }: Props) {
  const { slug } = await params;
  const p = decodeSlug(slug);
  if (!p) redirect("/trash-day");
  const f = buildFortune(p);

  return (
    <div className="gf-root">
      <div className="gf-orb gf-orb-p" aria-hidden />
      <div className="gf-orb gf-orb-c" aria-hidden />
      <main className="gf-main">
        <section className="gf-screen">
          <FortuneCard fortune={f} />
          <div className="gf-btns">
            <Link
              href="/trash-day"
              className="gf-btn x"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              📅 ごみ収集日カレンダーへ戻る
            </Link>
            <Link
              href="/"
              className="gf-siteLink"
              style={{ marginTop: 4 }}
            >
              ⊹ デコ文字メーカーでプロフを盛る ⊹
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
