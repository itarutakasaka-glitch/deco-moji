import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  decodeSlug,
  diagnose,
  RARITY_META,
  SNS_LABEL,
  STATS,
} from "@/lib/shindan-core";
import "../../shindan.css";

type Props = { params: Promise<{ slug: string }> };

// シェアされた結果ページは無限に生成されうるので noindex（薄いページの量産を防ぐ）
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeSlug(slug);
  if (!decoded) {
    return { robots: { index: false, follow: true } };
  }
  const d = diagnose(decoded.name, decoded.sns);
  const title = `${d.name} のSNS戦闘力は ${d.power.toLocaleString()}【${d.rarity}】`;
  const description = `称号：${d.plainTitle}。SNSパワー診断で自分の戦闘力を測ってみよう⚡`;
  const ogImage = `/shindan/og/${slug}`;
  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: "/shindan" },
    openGraph: {
      title,
      description,
      url: `/shindan/r/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ShindanResultPage({ params }: Props) {
  const { slug } = await params;
  const decoded = decodeSlug(slug);
  if (!decoded) redirect("/shindan");
  const d = diagnose(decoded.name, decoded.sns);

  return (
    <div className="sd-root">
      <main className="sd-main">
        <section className="sd-screen">
          <div className={`sd-shout sd-shout-${d.rarity}`}>
            {d.hidden ? "？？？" : d.rarity}
            <span className="sd-sub">{RARITY_META[d.rarity].sub}</span>
          </div>
          <div className="sd-cardwrap">
            <div className="sd-card" data-r={d.rarity}>
              <div className="sd-holo" />
              <div className="sd-cardinner">
                <div className="sd-sheen" />
                <div className="sd-cardhead">
                  <span className="sd-rbadge">{d.rarity}</span>
                  <span className="sd-cardlabel">SNS POWER CARD</span>
                </div>
                <p className="sd-user">
                  @ {d.name}（{SNS_LABEL[d.sns]}）
                </p>
                <p className="sd-title">{d.title}</p>
                <p className="sd-plabel">— SNS戦闘力 —</p>
                <p className="sd-power">{d.power.toLocaleString()}</p>
                <div className="sd-statrows">
                  {d.stats.map((v, i) => (
                    <div className="sd-statrow" key={STATS[i]}>
                      <span className="sd-nm">{STATS[i]}</span>
                      <div className="sd-barw">
                        <div className="sd-sbar" style={{ width: `${v}%` }} />
                      </div>
                      <span className="sd-vl">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="sd-comment">{d.comment}</div>
                <div className="sd-cardfoot">
                  <span className="sd-url">decomoji.xyz</span>
                  <span className="sd-tag">#SNSパワー診断</span>
                </div>
              </div>
            </div>
          </div>
          <div className="sd-sharebox">
            <Link
              href="/shindan"
              className="sd-sbtn sd-sx"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              ⚡ 自分のSNS戦闘力を測定する
            </Link>
            <p className="sd-backlink">
              <Link href="/">⊹ デコ文字メーカーでプロフを盛る ⊹</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
