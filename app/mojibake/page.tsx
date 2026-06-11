import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "特殊文字の文字化け早見表｜どの文字が化けやすい？□（豆腐）になる仕組みも解説",
  description:
    "デコ文字・特殊文字が「□」や「?」に文字化けする仕組みと、文字の種類ごとの化けやすさを早見表で解説。化けにくい鉄板の文字、相手の端末で確かめる方法、化けたときの対処まで。",
  alternates: { canonical: "/mojibake" },
  openGraph: {
    title: "特殊文字の文字化け早見表｜化けやすい文字・化けにくい文字",
    description: "□（豆腐）になる仕組みと、文字種別の化けやすさ評価。",
    url: "/mojibake",
  },
};

const faq = [
  {
    q: "特殊文字が「□」（四角）で表示されるのはなぜ？",
    a: "その端末に入っているフォントが、その文字の字形（グリフ）を持っていないためです。特殊文字はUnicodeという世界共通の文字規格に含まれていますが、すべての端末のフォントがすべての文字に対応しているわけではありません。対応していない文字は「□」（通称：豆腐）や「?」で表示されます。",
  },
  {
    q: "自分には見えているのに、相手には化けて見えることはある？",
    a: "あります。文字化けは「見る側の端末」で起きるため、新しいスマホを使っているあなたには正常に見えていても、古い端末やパソコンで見ている相手には□に見えていることがあります。大事な場面では化けにくい定番文字を選ぶのが安全です。",
  },
  {
    q: "文字化けしたら直す方法はある？",
    a: "相手側の表示を直すことはできません（相手の端末のフォント次第のため）。対処は「化けにくい文字に置き換える」一択です。このサイトの早見表で◎評価の文字に差し替えるか、装飾をシンプルにしましょう。",
  },
  {
    q: "一番化けにくい特殊文字はどれ？",
    a: "丸文字・白抜き英数字（ⓐ⓪🅐など）と、古くからある記号（☆★♡♪※〆）は20年近く前からUnicodeに収録されており、ほぼすべての端末で表示できます。装飾記号では ⊹ ✦ ✧ ⋆ あたりが定番かつ化けにくい部類です。",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

type Row = { sample: string; name: string; risk: "◎" | "○" | "△" | "✕"; why: string };
const rows: Row[] = [
  { sample: "☆ ♡ ♪ ※ 〆", name: "昔からある記号", risk: "◎", why: "初期のUnicodeから収録。ガラケー時代から使われており、まず化けない" },
  { sample: "ⓐ ① ㊗", name: "丸囲み文字", risk: "◎", why: "収録が古く、ほぼ全端末のフォントが対応" },
  { sample: "⊹ ✦ ✧ ⋆ ୨୧", name: "定番の装飾記号", risk: "○", why: "SNS装飾の定番。主要なスマホはほぼ対応、ごく古い端末では化けることも" },
  { sample: "𝓪 𝐀 𝙰（飾り英字）", name: "数学用英数字", risk: "○", why: "見た目は飾り文字だが正体は数学記号。スマホは概ね対応、一部の古いPC環境で化ける。検索にかからない点にも注意" },
  { sample: "꒰ ꒱ ᐢ ᰔ", name: "少数民族文字 由来", risk: "△", why: "かわいい装飾として人気だが、本来は別言語の文字。フォントによっては未対応" },
  { sample: "𓂃 𓈒 𓆉（線・生き物）", name: "ヒエログリフ", risk: "△", why: "古代エジプト文字。比較的新しい収録で、古い端末・一部PCで化けやすい" },
  { sample: "♡⃛ ⑅⃝（飾り重ね）", name: "結合文字", risk: "△", why: "文字に記号を重ねる仕組み。対応していない環境では分解されたり崩れたりする" },
  { sample: "🫶 🥹 など最新絵文字", name: "新しい絵文字", risk: "✕", why: "数年以内に追加された絵文字は、OSをアップデートしていない端末で確実に化ける" },
];

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl bg-white px-5 py-5 mb-6 text-[0.95rem] leading-relaxed"
      style={{ border: "2px solid var(--color-ink)" }}
    >
      {children}
    </div>
  );
}

export default function MojibakePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader
        title="特殊文字の文字化け早見表"
        tagline="化けやすい文字・化けにくい文字を知って、安全に盛る"
      />

      <Panel>
        <p>
          せっかく作ったデコ文字が、相手のスマホでは「□□□」…。
          これは特殊文字あるあるの悲劇です。文字化けは運ではなく仕組みで起きるので、
          <b>どの種類の文字が化けやすいかを知っていれば、ほぼ回避できます</b>。
          このページの評価は、各文字のUnicode収録時期と主要OS（iOS / Android / Windows）の
          標準フォントの対応状況をもとにした目安です。最終確認の方法も下で紹介します。
        </p>
      </Panel>

      <SectionTitle>📊 文字の種類別・化けやすさ早見表</SectionTitle>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-ink)" }}>
                <th className="text-left py-2 pr-2">例</th>
                <th className="text-left py-2 px-2">種類</th>
                <th className="text-center py-2 px-2">評価</th>
                <th className="text-left py-2 pl-2">理由</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {rows.map((r) => (
                <tr key={r.name} className="border-b border-pink-100">
                  <td className="py-2 pr-2 text-base whitespace-nowrap">{r.sample}</td>
                  <td className="py-2 px-2 font-bold whitespace-nowrap">{r.name}</td>
                  <td className="py-2 px-2 text-center text-base">{r.risk}</td>
                  <td className="py-2 pl-2">{r.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm" style={{ color: "var(--color-pink-4)" }}>
          ◎=ほぼ化けない ○=まず安心 △=相手によっては化ける ✕=古い端末では化ける前提で
        </p>
      </Panel>

      <SectionTitle>🔧 なぜ「□」になるのか（30秒で分かる仕組み）</SectionTitle>
      <Panel>
        <p className="mb-3">
          文字はそれぞれ「番号」（Unicodeコードポイント）で送受信されていて、
          <b>番号をどんな見た目で描くかは、受け取った端末のフォントの仕事</b>です。
          つまりデコ文字が化けるのは、送った文字が壊れたのではなく、
          相手のフォントに「その番号の字形が入っていない」だけ。
          だから同じ投稿でも、見る端末によって化けたり化けなかったりします。
        </p>
        <p>
          新しく追加された文字ほど、古い端末のフォントには入っていません。
          「最近見かけるようになったかわいい文字」ほど化けやすいのはこのためです。
        </p>
      </Panel>

      <SectionTitle>✅ 投稿前に自分で確かめる方法</SectionTitle>
      <Panel>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <b>PCブラウザで自分のプロフィールを見る</b> — スマホとPCはフォントが別なので、両方で出ればかなり安心
          </li>
          <li>
            <b>別OSの端末で見る</b> — iPhoneユーザーならAndroidの友達に、Androidユーザーなら逆に。1人に聞けば十分
          </li>
          <li>
            <b>迷ったら◎○の文字だけで組む</b> — このサイトの
            <Link href="/copy" className="underline">コピペ素材集</Link>
            は化けやすい素材に注記を付けています
          </li>
        </ol>
      </Panel>

      <SectionTitle>❓ よくある質問</SectionTitle>
      <Panel>
        {faq.map((f) => (
          <details key={f.q} className="mb-3 last:mb-0">
            <summary className="font-bold cursor-pointer">{f.q}</summary>
            <p className="mt-2 pl-4">{f.a}</p>
          </details>
        ))}
      </Panel>

      <Panel>
        <p className="text-center">
          SNS別の注意点は
          <Link href="/instagram" className="underline font-bold mx-1">インスタ</Link>/
          <Link href="/tiktok" className="underline font-bold mx-1">TikTok</Link>/
          <Link href="/x" className="underline font-bold mx-1">X</Link>
          のガイドへ ⊹ 変換は
          <Link href="/" className="underline font-bold mx-1">デコ文字メーカー</Link>
        </p>
      </Panel>

      <SiteFooter />
    </>
  );
}
