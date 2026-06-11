import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "X（旧Twitter）のデコ文字ガイド｜検索に出なくなる問題と読み上げ問題を正しく知る",
  description:
    "Xの表示名・bioで特殊文字（デコ文字）を使う前に知っておきたい、検索性への影響、スクリーンリーダーの読み上げ問題、文字数制限（表示名50字・bio160字）を解説。凍結リスクの有無も。",
  alternates: { canonical: "/x" },
  openGraph: {
    title: "Xのデコ文字ガイド｜検索性・読み上げ・文字数制限",
    description:
      "表示名50字・bio160字。デコ文字が検索とアクセシビリティに与える影響を正しく知って使いこなす。",
    url: "/x",
  },
};

const faq = [
  {
    q: "デコ文字を名前に入れるとアカウントが凍結されますか？",
    a: "特殊文字を使うこと自体は規約違反ではなく、それだけで凍結されることはありません。ただし、有名人のなりすましに見える使い方や、スパム的に記号を大量に並べる行為は別の規約に触れる可能性があります。普通に装飾として使う分には問題ありません。",
  },
  {
    q: "デコ文字にすると検索で見つけてもらえなくなる？",
    a: "はい、これがXでの最大の注意点です。特殊文字に変換した単語は、通常の文字での検索にヒットしません。たとえば活動名を全部デコ文字にすると、名前検索であなたを見つけられなくなります。検索されたい部分は通常の文字で残し、装飾は前後に付けましょう。",
  },
  {
    q: "ハッシュタグにデコ文字は使えますか？",
    a: "使えません。特殊文字を含めるとハッシュタグとして認識されず、リンクになりません。ハッシュタグは通常の文字だけで作りましょう。",
  },
  {
    q: "bioのデコ文字は読み上げソフトでどうなりますか？",
    a: "スクリーンリーダー（視覚障害のある方が使う読み上げソフト）は、装飾用の数学記号などを「マセマティカル ボールド キャピタル エー」のように1文字ずつ読み上げたり、読み飛ばしたりします。連絡先や重要な情報は通常の文字で書くのが親切です。",
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

export default function XGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader
        title="X（旧Twitter）のデコ文字ガイド"
        tagline="映え・検索性・読みやすさのバランスをとる使い方"
      />

      <Panel>
        <p>
          Xはデコ文字がいちばん広く使われているSNSで、表示名やbioの装飾は完全に文化として定着しています。
          ただしXには他のSNSにない特有の事情が2つあります。
          <b>「検索に引っかからなくなる」</b>ことと<b>「読み上げ環境で伝わらなくなる」</b>ことです。
          このページではその仕組みと、映えと実用を両立する使い方を解説します。
          変換は<Link href="/" className="underline">デコ文字メーカー</Link>でどうぞ。
        </p>
      </Panel>

      <SectionTitle>📍 使える場所と文字数制限</SectionTitle>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-ink)" }}>
                <th className="text-left py-2 pr-3">場所</th>
                <th className="text-center py-2 px-2">デコ文字</th>
                <th className="text-left py-2 pl-3">制限・メモ</th>
              </tr>
            </thead>
            <tbody className="align-top">
              <tr className="border-b border-pink-100">
                <td className="py-2 pr-3 font-bold">表示名</td>
                <td className="text-center py-2 px-2">◎</td>
                <td className="py-2 pl-3">50文字まで。変更回数の制限なし（インスタと違って気軽に試せる）</td>
              </tr>
              <tr className="border-b border-pink-100">
                <td className="py-2 pr-3 font-bold">ユーザー名（@〜）</td>
                <td className="text-center py-2 px-2">✕</td>
                <td className="py-2 pl-3">半角英数字とアンダースコアのみ・15文字まで</td>
              </tr>
              <tr className="border-b border-pink-100">
                <td className="py-2 pr-3 font-bold">bio（自己紹介）</td>
                <td className="text-center py-2 px-2">◎</td>
                <td className="py-2 pl-3">160文字まで。区切り線・行頭装飾が定番</td>
              </tr>
              <tr className="border-b border-pink-100">
                <td className="py-2 pr-3 font-bold">ポスト本文</td>
                <td className="text-center py-2 px-2">○</td>
                <td className="py-2 pl-3">使えるが検索性が落ちる（後述）。強調・見出し的な使い方が◎</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 font-bold">ハッシュタグ</td>
                <td className="text-center py-2 px-2">✕</td>
                <td className="py-2 pl-3">特殊文字が混ざるとタグとして認識されない</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm" style={{ color: "var(--color-pink-4)" }}>
          ※デコ文字は見た目1文字でも内部的には2文字以上とカウントされることが多く、表示名50字・bio160字の上限には早めに到達します。
        </p>
      </Panel>

      <SectionTitle>🔍 一番大事な話：デコ文字は「検索に出ない」</SectionTitle>
      <Panel>
        <p className="mb-3">
          Xの検索は文字コード単位で一致を見ています。デコ文字は見た目が同じでも
          <b>内部的には別の文字</b>なので、たとえば「ｈａｎａ」を装飾フォントにした名前は、
          「hana」で検索してもヒットしません。
        </p>
        <p className="mb-3">これで困るのは次のようなケースです：</p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>活動名・サークル名で検索してもらいたい創作アカウント</li>
          <li>名刺やポスターに「Xで『◯◯』と検索！」と書いている人</li>
          <li>同人イベント前後に名前検索される絵師・字書きさん</li>
        </ul>
        <p>
          <b>対策はシンプルで、「検索されたい部分は通常の文字のまま、装飾は前後に足す」</b>。
          例：<code>⊹꒰ はな ꒱⊹</code> なら「はな」で検索にヒットしますが、
          名前全体を特殊フォント化するとヒットしません。
          肩書きや絵文字的な飾りだけをデコ文字にするのが、映えと検索性の一番いいバランスです。
        </p>
      </Panel>

      <SectionTitle>🔊 読み上げ（アクセシビリティ）の話</SectionTitle>
      <Panel>
        <p className="mb-3">
          意外と知られていませんが、スクリーンリーダー（読み上げソフト）を使ってXを見ている人にとって、
          装飾用の特殊文字は「読めない」か「異常に長く読み上げられる」かのどちらかになりがちです。
          装飾文字の正体は数学用の記号などで、1文字ずつ正式名称で読み上げられてしまうためです。
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>bioの<b>連絡先・お仕事募集・通販リンクの説明などの重要情報は通常の文字で</b></li>
          <li>装飾は「なくても意味が通じる」部分（区切り線・飾り）に留める</li>
          <li>ポスト本文の全文デコ文字化は、読める人を選ぶ表現だと知った上で使う</li>
        </ul>
      </Panel>

      <SectionTitle>✍️ bioの組み立てテンプレ</SectionTitle>
      <Panel>
        <p className="mb-3">160文字を活かす定番構成です（そのまま真似してOK）：</p>
        <ol className="list-decimal pl-5 space-y-1 mb-3">
          <li>1行目：装飾入りの肩書き（ここがデコ文字の見せ場）</li>
          <li>2行目：何をする人か・好きなもの（通常の文字で検索性を確保）</li>
          <li>3行目：区切り線（┈┈や⊹˚₊）</li>
          <li>4行目：リンク誘導や注意書き（通常の文字で）</li>
        </ol>
        <p>
          装飾パーツは<Link href="/" className="underline">デコ文字メーカーの装飾フレーム集</Link>からコピーできます。
        </p>
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
          バランスがわかったら
          <Link href="/" className="underline font-bold mx-1">
            デコ文字メーカーで表示名・bioを変換
          </Link>
          ⊹ あなたのSNS戦闘力は
          <Link href="/shindan" className="underline font-bold mx-1">
            SNSパワー診断
          </Link>
          で測定
        </p>
      </Panel>

      <SiteFooter />
    </>
  );
}
