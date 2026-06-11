import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "インスタでデコ文字が使える場所・使えない場所 完全ガイド｜名前変更の14日ルールも解説",
  description:
    "Instagramのプロフィール名・ユーザーネーム・自己紹介・ハイライトのどこで特殊文字（デコ文字）が使えるかを徹底解説。名前変更の「14日以内2回まで」ルール、文字数制限の早見表、反映されない時のチェックリスト付き。",
  alternates: { canonical: "/instagram" },
  openGraph: {
    title: "インスタのデコ文字 完全ガイド｜使える場所・14日ルール・文字数制限",
    description:
      "プロフィール名・bio・ハイライトのどこで特殊文字が使える？名前変更の14日ルールと対処法も。",
    url: "/instagram",
  },
};

const faq = [
  {
    q: "インスタの名前が変更できません。なぜ？",
    a: "Instagramの名前（表示名）は過去14日以内に2回までしか変更できません。3回目を試みると「過去14日以内に名前が2回変更されたため、変更できません」と表示されます。アカウント乗っ取り対策の仕様で、裏技で解除する方法はありません。14日待ってから変更しましょう。",
  },
  {
    q: "ユーザーネーム（@〜）にデコ文字は使えますか？",
    a: "使えません。ユーザーネームは半角英数字・ピリオド・アンダースコアのみ（30文字以内）という仕様です。デコ文字を使えるのは「名前（表示名）」と「自己紹介」「ハイライト名」などです。",
  },
  {
    q: "デコ文字を使うとシャドウバンされますか？",
    a: "特殊文字を使うこと自体は規約違反ではなく、それだけでシャドウバンされることはありません。ただし検索には引っかかりにくくなるため、検索で見つけてほしいキーワード（活動名やブランド名）は通常の文字でも併記するのがおすすめです。",
  },
  {
    q: "貼り付けたデコ文字が「□」や「?」になります",
    a: "機種依存の文字化けです。相手の端末やアプリのバージョンによっては表示できない特殊文字があります。Unicodeの標準的な範囲の文字（このサイトのジェネレーターで「定番」とされている変換）を選ぶと文字化けしにくくなります。",
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

export default function InstagramGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader
        title="インスタのデコ文字 完全ガイド"
        tagline="使える場所・使えない場所、14日ルール、文字化け対策まで"
      />

      <Panel>
        <p>
          Instagramは「名前」「ユーザーネーム」「自己紹介」など入力欄ごとにルールが違っていて、
          デコ文字（特殊文字）が<b>使える場所と使えない場所がはっきり分かれています</b>。
          さらに名前には「14日以内に2回まで」という変更回数の制限もあるため、
          何も知らずに試行錯誤すると2週間ロックされてしまうことも。
          このページでは、インスタでデコ文字を安全に使いこなすための実用情報をまとめました。
          文字の変換そのものは<Link href="/" className="underline">デコ文字メーカー</Link>でどうぞ。
        </p>
      </Panel>

      <SectionTitle>📍 デコ文字が使える場所・使えない場所</SectionTitle>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-ink)" }}>
                <th className="text-left py-2 pr-3">場所</th>
                <th className="text-center py-2 px-2">デコ文字</th>
                <th className="text-left py-2 pl-3">メモ</th>
              </tr>
            </thead>
            <tbody className="align-top">
              <tr className="border-b border-pink-100">
                <td className="py-2 pr-3 font-bold">名前（表示名）</td>
                <td className="text-center py-2 px-2">◎</td>
                <td className="py-2 pl-3">いちばん映える場所。ただし変更は14日に2回まで（後述）</td>
              </tr>
              <tr className="border-b border-pink-100">
                <td className="py-2 pr-3 font-bold">ユーザーネーム（@〜）</td>
                <td className="text-center py-2 px-2">✕</td>
                <td className="py-2 pl-3">半角英数字・ピリオド・アンダースコアのみ。仕様上不可能</td>
              </tr>
              <tr className="border-b border-pink-100">
                <td className="py-2 pr-3 font-bold">自己紹介（bio）</td>
                <td className="text-center py-2 px-2">◎</td>
                <td className="py-2 pl-3">行頭の装飾や区切り線が人気。150文字まで</td>
              </tr>
              <tr className="border-b border-pink-100">
                <td className="py-2 pr-3 font-bold">ハイライト名</td>
                <td className="text-center py-2 px-2">◎</td>
                <td className="py-2 pl-3">短いのでワンポイント装飾（♡や⊹）が効く</td>
              </tr>
              <tr className="border-b border-pink-100">
                <td className="py-2 pr-3 font-bold">キャプション・コメント</td>
                <td className="text-center py-2 px-2">◎</td>
                <td className="py-2 pl-3">使えるが、検索に引っかからなくなる点に注意</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 font-bold">ストーリーの文字入れ</td>
                <td className="text-center py-2 px-2">○</td>
                <td className="py-2 pl-3">貼り付け可。ただしアプリ内蔵フォントとは別物</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <SectionTitle>⏰ 名前変更の「14日ルール」を知らないと詰む</SectionTitle>
      <Panel>
        <p className="mb-3">
          インスタの名前（表示名）は<b>過去14日以内に2回まで</b>しか変更できません。
          3回目を試すと「過去14日以内に名前が2回変更されたため、変更できません」と表示され、
          期間が明けるまで一切変更できなくなります。アカウント乗っ取り対策の公式仕様で、解除する裏技はありません。
        </p>
        <p className="mb-3">
          つまり、デコ文字をあれこれ試しながら何度も名前を変えるのは危険です。おすすめの手順は：
        </p>
        <ol className="list-decimal pl-5 space-y-1 mb-3">
          <li>
            <Link href="/" className="underline">デコ文字メーカー</Link>
            で候補をいくつか作って、メモアプリに貼って見比べる
          </li>
          <li>いちばん気に入った1つに決めてから、インスタの名前を変更する</li>
          <li>万一文字化けしていたら、残り1回で「定番」系の無難な変換に差し替える</li>
        </ol>
        <p className="text-sm" style={{ color: "var(--color-pink-4)" }}>
          ※ユーザーネーム（@〜）の変更には回数制限はありませんが、変更すると旧URLが無効になるので別の意味で慎重に。
        </p>
      </Panel>

      <SectionTitle>🔢 文字数制限 早見表</SectionTitle>
      <Panel>
        <ul className="space-y-2">
          <li>
            <b>名前（表示名）</b>：最大64文字（環境によっては30文字までと案内されることもあります）。
            デコ文字は見た目1文字でも内部的に2文字以上とカウントされるものがあるので、長い装飾は早めに上限に到達します
          </li>
          <li>
            <b>ユーザーネーム</b>：30文字以内・半角英数字とピリオド・アンダースコアのみ
          </li>
          <li>
            <b>自己紹介</b>：150文字。装飾フレームを使うなら本文は120文字程度に収めるイメージで
          </li>
        </ul>
      </Panel>

      <SectionTitle>🔧 反映されない・文字化けする時のチェックリスト</SectionTitle>
      <Panel>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <b>保存したのに元に戻る</b> → 14日ルールに引っかかっていないか確認。エラー文言が出ずに弾かれることもあります
          </li>
          <li>
            <b>自分には見えるのに友達には「□」</b> → 相手の端末が古いか、その文字が機種依存。
            「数学用英数字記号」系の凝ったフォントほど化けやすく、丸文字・定番フレームは化けにくい傾向です
          </li>
          <li>
            <b>コピペしたら余計な空白が入る</b> → 貼り付け後に前後の空白を削除。見えない制御文字が混ざると保存に失敗することもあります
          </li>
          <li>
            <b>PCブラウザとアプリで見た目が違う</b> → フォントレンダリングの差で正常です。フォロワーの大半はスマホなので、スマホ表示を正とするのがおすすめ
          </li>
        </ul>
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
          準備ができたら
          <Link href="/" className="underline font-bold mx-1">
            デコ文字メーカーで名前・bioを変換
          </Link>
          ⊹ プロフィールを丸ごと盛るなら
          <Link href="/kabegami" className="underline font-bold mx-1">
            推しメンカラ壁紙メーカー
          </Link>
          もどうぞ
        </p>
      </Panel>

      <SiteFooter />
    </>
  );
}
