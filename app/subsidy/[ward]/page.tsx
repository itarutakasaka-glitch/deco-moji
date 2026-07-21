import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import wardsData from "@/lib/subsidy/tokyo-wards.json";
import { WARD_SLUGS } from "@/lib/subsidy/ward-slugs";
import { parseDeadlineIso, daysUntil, jstToday } from "@/lib/subsidy/deadline";
import { siteConfig } from "@/lib/site-config";
import "../subsidy.css";

type WardSubsidy = {
  name: string;
  field: string[];
  summary?: string;
  target?: string;
  maxAmount?: string | null;
  rate?: string | null;
  deadline?: string | null;
  url: string;
};
type WardData = { indexUrl?: string; lastChecked?: string; subsidies: WardSubsidy[] };
const WARDS = wardsData as Record<string, WardData>;

type Props = { params: Promise<{ ward: string }> };

export const dynamicParams = false;
// 締切切れの制度を日次で自動的に一覧から外すためのISR
export const revalidate = 86400;

export function generateStaticParams() {
  return WARD_SLUGS.map((w) => ({ ward: w.slug }));
}

function findEntry(slug: string) {
  return WARD_SLUGS.find((w) => w.slug === slug);
}

function activeSubsidies(name: string) {
  const wd = WARDS[name];
  if (!wd) return { wd: undefined, list: [] as WardSubsidy[] };
  const today = jstToday();
  const list = wd.subsidies.filter((s) => {
    const iso = parseDeadlineIso(s.deadline);
    if (!iso) return true; // 通年・予算上限まで・締切未定は残す
    return daysUntil(iso, today) >= 0;
  });
  return { wd, list };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ward } = await params;
  const entry = findEntry(ward);
  if (!entry) return {};
  const { list } = activeSubsidies(entry.name);
  const title = `${entry.name}の補助金・助成金一覧【事業者向け・募集中のみ】`;
  const description = `${entry.name}の事業者向け補助金・助成金${list.length}件を掲載（募集終了分は自動非表示）。最終確認日 ${WARDS[entry.name]?.lastChecked ?? ""}。応募前に必ず公式ページで最新情報をご確認ください。`;
  return {
    title,
    description,
    alternates: { canonical: `/subsidy/${entry.slug}` },
    openGraph: { title, description, url: `/subsidy/${entry.slug}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function WardSubsidyPage({ params }: Props) {
  const { ward } = await params;
  const entry = findEntry(ward);
  if (!entry) notFound();
  const { wd, list } = activeSubsidies(entry.name);
  if (!wd) notFound();

  const others = WARD_SLUGS.filter((w) => w.slug !== entry.slug);
  const top3 = list.slice(0, 3).map((s) => s.name);

  const faqs = [
    {
      q: `${entry.name}の事業者向け補助金にはどんなものがありますか？`,
      a:
        top3.length > 0
          ? `${top3.join("、")}など全${list.length}件を掲載しています（最終確認日 ${wd.lastChecked ?? "未確認"}）。`
          : `現在掲載中の制度はありません（最終確認日 ${wd.lastChecked ?? "未確認"}）。`,
    },
    {
      q: "申請の相談はどこにすればよいですか？",
      a: "区の窓口のほか、東京都よろず支援拠点など無料の公的相談窓口があります。本サイトは情報提供のみで申請代行は行いません。",
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
        name: "補助金・助成金診断",
        item: `${siteConfig.url}/subsidy`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: entry.name,
        item: `${siteConfig.url}/subsidy/${entry.slug}`,
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
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: list.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
    })),
  };

  return (
    <div className="sf-root" style={{ minHeight: "auto" }}>
      <main className="sf-main sw-main">
        <nav className="sw-breadcrumb" aria-label="パンくず">
          <Link href="/">ホーム</Link>
          {" > "}
          <Link href="/subsidy">補助金・助成金診断</Link>
          {" > "}
          <span>{entry.name}</span>
        </nav>

        <h1 className="sw-h1">{entry.name}の事業者向け補助金・助成金一覧</h1>

        <p className="sw-lead">
          {entry.name}の事業者向け補助金・助成金を{list.length}件掲載しています。
          {wd.indexUrl && (
            <>
              区の公式一覧は
              <a href={wd.indexUrl} target="_blank" rel="noopener noreferrer">
                こちら
              </a>
              。
            </>
          )}
          最終確認日 {wd.lastChecked ?? "未確認"}。掲載は参考情報です。応募前に必ず公式ページで最新情報をご確認ください。
        </p>

        <div className="sf-list">
          {list.map((s, i) => (
            <a
              className="sf-card ward"
              key={`${s.name}-${i}`}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="sf-cardTop">
                <span className="sf-area">{entry.name}</span>
                {s.deadline && <span className="sf-deadline">{s.deadline}</span>}
              </div>
              <div className="sf-title">{s.name}</div>
              {s.summary && <div className="sf-sum">{s.summary}</div>}
              <div className="sf-meta">
                {s.maxAmount && (
                  <span className="sf-metaItem">
                    <span className="sf-metaCap">上限</span>
                    {s.maxAmount}
                  </span>
                )}
                {s.rate && (
                  <span className="sf-metaItem">
                    <span className="sf-metaCap">補助率</span>
                    {s.rate}
                  </span>
                )}
              </div>
              {s.target && <div className="sf-inst">対象：{s.target}</div>}
              <div className="sf-cta">区の公式ページで詳細・申請 →</div>
            </a>
          ))}
        </div>

        <div className="sf-advice">
          <div className="sf-adviceT">申請してみたい制度が見つかったら</div>
          <p>
            補助金・助成金は<b>要件確認・事業計画・書類作成</b>がカギです。採択率を上げたい・手続きが不安な場合は、
            税理士・行政書士・中小企業診断士など<b>専門家に相談</b>するのが近道です。
            （本サイトは情報提供のみで、申請の代行は行いません。）
          </p>
        </div>

        <h2 className="sw-h2">よくある質問</h2>
        <dl className="sw-faq">
          {faqs.map((f) => (
            <div key={f.q} className="sw-faqItem">
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>

        <p className="sw-toolLink">
          目的で絞って探す →{" "}
          <Link href="/subsidy">補助金・助成金診断を開く</Link>
        </p>

        <h2 className="sw-h2">東京23区のほかの区</h2>
        <ul className="sw-linklist">
          {others.map((w) => (
            <li key={w.slug}>
              <Link href={`/subsidy/${w.slug}`}>{w.name}</Link>
            </li>
          ))}
        </ul>

        <p className="sf-disclaimer">
          ※ 掲載情報は、東京23区は各区公式サイトを基にした<b>参考情報</b>です。募集状況・要件・締切は変わることがあるため、
          応募前に必ず各制度の公式ページで最新・正確な情報をご確認ください。「必ず受給できる」ことを保証するものではありません。
        </p>
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
    </div>
  );
}
