import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "TikTokのデコ文字ガイド｜ニックネームは7日に1回・ユーザー名は30日に1回しか変えられない",
  description:
    "TikTokのニックネーム（表示名）とユーザー名の違い、変更回数の制限（7日/30日ルール）、特殊文字が使える場所、端末による文字化けの見分け方を解説。推し活・配信で映えるデコ文字の使い方も。",
  alternates: { canonical: "/tiktok" },
  openGraph: {
    title: "TikTokのデコ文字ガイド｜7日ルールと文字化け対策",
    description:
      "ニックネームとユーザー名の違い、変更制限、特殊文字の文字化け対策を徹底解説。",
    url: "/tiktok",
  },
};

const faq = [
  {
    q: "TikTokのニックネームが変更できません",
    a: "TikTokのニックネーム（表示名）は7日に1回しか変更できません。一度変えると次の変更まで7日待つ必要があります。デコ文字を試すときは、先に候補を決めてから変更しましょう。",
  },
  {
    q: "ユーザー名（@〜）にデコ文字は使えますか？",
    a: "使えません。ユーザー名は半角英数字・アンダースコア・ピリオドのみ、2〜24文字という仕様です。さらに変更は30日に1回まで。デコ文字が使えるのはニックネーム（表示名）と自己紹介です。",
  },
  {
    q: "コメントでデコ文字を使うと相手に見えないことがある？",
    a: "あります。TikTokは特に若年層の幅広い端末で見られるため、凝った特殊文字は視聴者の端末によって「□」（豆腐）に化けることがあります。ニックネームには定番の装飾、コメントにはシンプルな記号を使うのが安全です。",
  },
  {
    q: "デコ文字を使うとおすすめに乗りにくくなりますか？",
    a: "特殊文字の使用がリーチに影響するという公式情報はありません。ただし検索でアカウント名がヒットしにくくなるため、検索されたい名前（活動名）は通常の文字で残し、装飾は前後に付けるのがおすすめです。",
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

export default function TiktokGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader
        title="TikTokのデコ文字ガイド"
        tagline="ニックネームの7日ルール、ユーザー名との違い、文字化けの見分け方"
      />

      <Panel>
        <p>
          TikTokでデコ文字を使うとき、まず知っておきたいのが
          <b>「ニックネーム」と「ユーザー名」は別物</b>で、それぞれ変更ルールが全然違うこと。
          そして<b>変更回数に厳しい制限がある</b>ことです。
          知らずに適当な名前で変更してしまうと、直したくても1週間〜1ヶ月待つはめになります。
          このページでルールを押さえてから、
          <Link href="/" className="underline">デコ文字メーカー</Link>で名前を作りましょう。
        </p>
      </Panel>

      <SectionTitle>🆚 ニックネームとユーザー名の違い（ここが一番大事）</SectionTitle>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-ink)" }}>
                <th className="text-left py-2 pr-3"></th>
                <th className="text-left py-2 px-2">ニックネーム（表示名）</th>
                <th className="text-left py-2 pl-3">ユーザー名（@〜）</th>
              </tr>
            </thead>
            <tbody className="align-top">
              <tr className="border-b border-pink-100">
                <td className="py-2 pr-3 font-bold">デコ文字</td>
                <td className="py-2 px-2">◎ 使える</td>
                <td className="py-2 pl-3">✕ 半角英数・_・.のみ</td>
              </tr>
              <tr className="border-b border-pink-100">
                <td className="py-2 pr-3 font-bold">文字数</td>
                <td className="py-2 px-2">30文字まで</td>
                <td className="py-2 pl-3">2〜24文字</td>
              </tr>
              <tr className="border-b border-pink-100">
                <td className="py-2 pr-3 font-bold">変更頻度</td>
                <td className="py-2 px-2">
                  <b>7日に1回</b>
                </td>
                <td className="py-2 pl-3">
                  <b>30日に1回</b>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-3 font-bold">役割</td>
                <td className="py-2 px-2">画面に大きく表示される名前</td>
                <td className="py-2 pl-3">プロフィールURL・検索ID</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm" style={{ color: "var(--color-pink-4)" }}>
          ※デコ文字で遊べるのはニックネームだけ。ユーザー名は「変えると旧URLが無効になる」ので基本固定がおすすめです。
        </p>
      </Panel>

      <SectionTitle>⏰ 失敗しない変更手順（7日ルール対策）</SectionTitle>
      <Panel>
        <ol className="list-decimal pl-5 space-y-2 mb-3">
          <li>
            <Link href="/" className="underline">デコ文字メーカー</Link>
            でニックネーム候補を3つくらい作る（30文字制限に注意。装飾は内部的に文字数を多く消費します）
          </li>
          <li>メモアプリに貼って、スマホでの見た目を確認</li>
          <li>できれば家族や友達の別端末（特にAndroid⇔iPhoneの違う方）に送って文字化けチェック</li>
          <li>1つに決めてから TikTok のプロフィール編集で変更（ここで7日ロック開始）</li>
        </ol>
        <p>
          ライブ配信をする人は特に注意。配信中に表示されるのはニックネームなので、
          配信直前に変更して失敗すると、化けた名前のまま配信する羽目になります。
          <b>配信の数日前に変更して様子を見る</b>のが安全です。
        </p>
      </Panel>

      <SectionTitle>📱 TikTok特有の「文字化け」事情</SectionTitle>
      <Panel>
        <p className="mb-3">
          TikTokの視聴者層は使っている端末の幅が広く、
          <b>凝った特殊文字ほど一部の人には「□」（通称：豆腐）に見えている</b>可能性が上がります。
          フォロワーに届かないデコ文字は本末転倒なので、化けにくさで選ぶのがコツです。
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <b>化けにくい</b>：丸文字系、白抜き英数字、定番の装飾記号（⊹ ꒰ ꒱ ♡ ✦ など）
          </li>
          <li>
            <b>化けやすい</b>：マイナーな結合文字、装飾を何重にも重ねたもの、最近追加されたUnicode絵文字
          </li>
          <li>
            <b>確認方法</b>：PCブラウザ版TikTokで自分のプロフィールを開く、別OSの端末で見る、の2つでほぼ判定できます
          </li>
        </ul>
      </Panel>

      <SectionTitle>🎤 推し活・配信者のデコ文字活用例</SectionTitle>
      <Panel>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <b>ファンネーム＋装飾</b>：「⊹꒰ ◯◯組 ꒱⊹」のようにファンマーク的に使うと、コメント欄で仲間を見つけやすい
          </li>
          <li>
            <b>推しの誕生日仕様</b>：期間限定でニックネームに日付装飾を入れる文化。ただし7日ルールがあるので、戻すタイミングまで計算して
          </li>
          <li>
            <b>自己紹介はシンプルに</b>：TikTokのbioは短いので、装飾は1行目のワンポイントに絞ると読みやすい
          </li>
          <li>
            スマホのロック画面まで揃えるなら
            <Link href="/kabegami" className="underline">推しメンカラ壁紙メーカー</Link>
            でメンバーカラーの壁紙も作れます
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
          ルールを押さえたら
          <Link href="/" className="underline font-bold mx-1">
            デコ文字メーカーでニックネームを変換
          </Link>
          ⊹ 暇つぶしには
          <Link href="/shindan" className="underline font-bold mx-1">
            SNSパワー診断
          </Link>
          もどうぞ
        </p>
      </Panel>

      <SiteFooter />
    </>
  );
}
