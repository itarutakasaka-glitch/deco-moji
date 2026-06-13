import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { diagnoseCompat, decodeSlug } from "@/lib/compatibility-core";
import CompatCard from "@/components/CompatCard";
import "../../compatibility.css";

type Props = { params: Promise<{ slug: string }> };

// シェアされた結果ページは無限に生成されうるので noindex
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeSlug(slug);
  if (!decoded) return { robots: { index: false, follow: true } };
  const d = diagnoseCompat(decoded.a, decoded.b);
  const title = `${d.nameA} × ${d.nameB} の相性は ${d.score}%【${d.tierLabel}】`;
  const description = `${d.comment} デコ文字相性診断で二人の相性を測ってみよう💞`;
  const ogImage = `/compatibility/og/${slug}`;
  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: "/compatibility" },
    openGraph: {
      title,
      description,
      url: `/compatibility/r/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function CompatResultPage({ params }: Props) {
  const { slug } = await params;
  const decoded = decodeSlug(slug);
  if (!decoded) redirect("/compatibility");
  const d = diagnoseCompat(decoded.a, decoded.b);

  return (
    <div className="cp-root">
      <main className="cp-main">
        <section className="cp-screen">
          <CompatCard result={d} />
          <div className="cp-btns">
            <Link
              href="/compatibility"
              className="cp-btn x"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              💞 自分の相性も診断する
            </Link>
            <Link href="/play" className="cp-sitelink" style={{ marginTop: 4 }}>
              ほかの診断・占いであそぶ →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
