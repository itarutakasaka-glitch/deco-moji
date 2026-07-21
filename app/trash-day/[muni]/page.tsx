import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MUNI_REGISTRY } from "@/lib/gomi/registry";
import { loadMuni } from "@/lib/gomi/load-muni";
import { describeRule, CATEGORY_LABELS } from "@/lib/gomi/shared";
import { siteConfig } from "@/lib/site-config";
import "../trash-day.css";
import "./muni-page.css";

type Props = { params: Promise<{ muni: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return MUNI_REGISTRY.map((m) => ({ muni: m.slug }));
}

function findEntry(slug: string) {
  return MUNI_REGISTRY.find((m) => m.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { muni } = await params;
  const entry = findEntry(muni);
  if (!entry) return {};
  const data = loadMuni(entry.file);
  const catLabels = data.presentKeys
    .map((k) => data.categories[k] ?? CATEGORY_LABELS[k])
    .join("・");
  const title = `${data.name}のごみ収集日一覧【町丁目別】🗑️何曜日に出す？`;
  const description = `${data.name}の町丁目別ごみ収集日（全${data.rows.length}丁目）。${catLabels}の収集曜日を一覧表で確認できます。出典: ${data.source}（最終確認日 ${data.fetchedAt}）。`;
  return {
    title,
    description,
    alternates: { canonical: `/trash-day/${entry.slug}` },
    openGraph: { title, description, url: `/trash-day/${entry.slug}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function MuniPage({ params }: Props) {
  const { muni } = await params;
  const entry = findEntry(muni);
  if (!entry) notFound();
  const data = loadMuni(entry.file);

  const sameCity = MUNI_REGISTRY.filter((m) => m.city === entry.city && m.slug !== entry.slug);

  const firstKey = data.presentKeys[0];
  const firstKeyLabel = firstKey ? (data.categories[firstKey] ?? CATEGORY_LABELS[firstKey]) : "";
  const firstRow = data.rows[0];

  const faqs = [
    {
      q: `${data.name}の${firstKeyLabel}は何曜日ですか？`,
      a: firstRow
        ? `丁目により異なります。例えば${firstRow.chome}は「${describeRule(
            firstKey ? firstRow.rules[firstKey] : undefined
          )}」です。下の一覧表でお住まいの丁目をご確認ください。`
        : "丁目により異なります。下の一覧表でお住まいの丁目をご確認ください。",
    },
    {
      q: "このデータの出典はどこですか？",
      a: `${data.source}を基に作成しています（最終確認日 ${data.fetchedAt}）。`,
    },
    {
      q: "祝日や年末年始の収集はどうなりますか？",
      a: "特別日程になる場合があります。公式サイトで最新の情報をご確認ください。",
    },
  ];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "ごみ収集日カレンダー",
        item: `${siteConfig.url}/trash-day`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.name,
        item: `${siteConfig.url}/trash-day/${entry.slug}`,
      },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const datasetLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${data.name} ごみ収集日データ（町丁目別）`,
    description: `${data.name}の町丁目別ごみ収集日一覧（全${data.rows.length}丁目）`,
    dateModified: data.fetchedAt,
    creator: { "@type": "WebSite", name: "デコ文字メーカー", url: siteConfig.url },
  };
  if (data.sourceUrl) datasetLd.isBasedOn = data.sourceUrl;
  if (data.license) datasetLd.license = data.license;

  return (
    <div className="gf-root" style={{ minHeight: "auto" }}>
      <main className="gf-main gw-main">
        <nav className="gw-breadcrumb" aria-label="パンくず">
          <Link href="/">ホーム</Link>
          {" > "}
          <Link href="/trash-day">ごみ収集日カレンダー</Link>
          {" > "}
          <span>{data.name}</span>
        </nav>

        <h1 className="gw-h1">{data.name}のごみ収集日（町丁目別一覧）</h1>

        <p className="gw-lead">
          {data.name}の全{data.rows.length}丁目のごみ収集日一覧です。出典：
          {data.sourceUrl ? (
            <a href={data.sourceUrl} target="_blank" rel="noopener noreferrer">
              {data.source}
            </a>
          ) : (
            data.source
          )}
          （最終確認日 {data.fetchedAt}）。収集日は変更される場合があります。必ず公式サイトで最新情報をご確認ください。
        </p>

        {data.omitNote && <p className="gw-omitNote">※ {data.omitNote}</p>}

        <div className="gw-tablewrap">
          <table className="gw-table">
            <thead>
              <tr>
                <th>丁目</th>
                {data.presentKeys.map((k) => (
                  <th key={k}>{data.categories[k] ?? CATEGORY_LABELS[k]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r, i) => (
                <tr key={`${r.chome}-${i}`}>
                  <td className="gw-chomeCell">{r.chome}</td>
                  {data.presentKeys.map((k) => (
                    <td key={k}>{describeRule(r.rules[k])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="gw-h2">よくある質問</h2>
        <dl className="gw-faq">
          {faqs.map((f) => (
            <div key={f.q} className="gw-faqItem">
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>

        <p className="gw-toolLink">
          日付を指定して「次の収集日」を調べる →{" "}
          <Link href="/trash-day">ごみ収集日カレンダーを開く</Link>
        </p>

        {sameCity.length > 0 && (
          <>
            <h2 className="gw-h2">{entry.city}のほかの区</h2>
            <ul className="gw-linklist">
              {sameCity.map((m) => (
                <li key={m.slug}>
                  <Link href={`/trash-day/${m.slug}`}>{m.name}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }}
      />
    </div>
  );
}
