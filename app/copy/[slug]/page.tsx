import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";
import TipsBox from "@/components/TipsBox";
import CopyTile from "@/components/CopyTile";
import { COPY_CATEGORIES, getCopyCategory } from "@/lib/copy-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COPY_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCopyCategory(slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/copy/${c.slug}` },
    openGraph: { title: c.title, description: c.description, url: `/copy/${c.slug}` },
  };
}

export default async function CopyCategoryPage({ params }: Props) {
  const { slug } = await params;
  const c = getCopyCategory(slug);
  if (!c) notFound();

  return (
    <>
      <SiteHeader title={c.h1} tagline={c.tagline} />

      <div
        className="rounded-2xl bg-white px-5 py-4 mb-6 text-[0.95rem] leading-relaxed"
        style={{ border: "2px solid var(--color-ink)" }}
      >
        {c.intro}
      </div>

      {c.groups.map((g) => (
        <section key={g.title}>
          <SectionTitle>⊹ {g.title}</SectionTitle>
          {g.note && (
            <p className="mb-3 text-sm" style={{ color: "var(--color-pink-4)" }}>
              {g.note}
            </p>
          )}
          <div className="mb-6">
            {g.items.map((item) => (
              <CopyTile key={item} text={item} />
            ))}
          </div>
        </section>
      ))}

      <TipsBox title="使い方のコツ" tips={c.tips} />

      <div
        className="rounded-2xl bg-white px-5 py-4 my-6 text-center text-[0.95rem]"
        style={{ border: "2px solid var(--color-ink)" }}
      >
        <p className="mb-2">
          <Link href="/copy" className="underline font-bold">
            ← 他のカテゴリを見る
          </Link>
        </p>
        <p>
          名前ごと変換するなら
          <Link href="/" className="underline font-bold mx-1">
            デコ文字メーカー
          </Link>
          ⊹ 推しのメンカラ壁紙は
          <Link href="/kabegami" className="underline font-bold mx-1">
            壁紙メーカー
          </Link>
        </p>
      </div>

      <SiteFooter />
    </>
  );
}
