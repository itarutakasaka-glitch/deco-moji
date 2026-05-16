import type { Metadata } from "next";
import BlogLayout from "@/components/BlogLayout";
import { getBlogPost } from "@/lib/blog-posts";

const post = getBlogPost("machine-dependent-characters")!;

export const metadata: Metadata = {
  title: `${post.title}｜デコ文字メーカー`,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    title: post.title,
    description: post.description,
    type: "article",
    publishedTime: post.publishedAt,
  },
};

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        せっかくデコ文字を使ってプロフィールを盛ったのに、友達のスマホで見せてもらったら「□」が並んでいた…そんな経験はありませんか？これが「機種依存文字」の正体です。
      </p>
      <p className="mt-3">
        この記事では、機種依存文字の仕組み、iPhoneとAndroidで表示が違う理由、対策方法をわかりやすく解説します。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        機種依存文字とは
      </h2>
      <p>
        機種依存文字とは、<strong>特定の端末・OS・フォント環境でしか正しく表示されない文字</strong>のことです。本来Unicodeで定義されている文字でも、相手の環境にその文字を表示するためのフォントが入っていないと、「□」や「?」、「.notdef」（未定義）として表示されてしまいます。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">なぜ機種で差が出るのか</h3>
      <p>
        Unicodeは「この番号にはこの文字を割り当てる」という規格を決めているだけで、実際の表示はその端末に入っているフォントが担います。フォントは、それぞれの文字をどんな見た目で表示するかをまとめたデータです。
      </p>
      <p className="mt-3">
        新しい絵文字や特殊文字がUnicodeに追加されても、それを表示できるフォントが端末に入っていなければ「□」になります。古い端末で新しい絵文字が表示されないのは、これが原因です。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        iPhoneとAndroidの違い
      </h2>

      <h3 className="text-lg mt-6 mb-2 font-semibold">iPhone（iOS）の特徴</h3>
      <p>
        iPhoneは、Appleが独自にデザインしたフォント「Apple Color Emoji」と「San Francisco」シリーズを搭載しています。Unicodeのほとんどの文字をカバーしており、特殊文字・絵文字ともに表示できる範囲が広いのが特徴です。
      </p>
      <p className="mt-3">
        ただし、Apple独自のフォントデザインなので、同じ絵文字でも他社製の端末とは絵柄が違って見えます。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">Androidの特徴</h3>
      <p>
        Androidは、Googleの「Noto Sans」「Noto Color Emoji」を標準としていますが、メーカーや機種によって独自のフォントを使っていることがあります。例えば:
      </p>
      <ul className="list-disc pl-6 space-y-1 mt-3">
        <li>Samsung（Galaxy）: 独自の絵文字デザイン</li>
        <li>Xiaomi: MIUIフォント</li>
        <li>Pixel: Google純正のNotoフォント</li>
      </ul>
      <p className="mt-3">
        さらに、古い機種ではフォントのバージョンが古く、新しいUnicode文字をサポートしていないことがあります。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">Windows・Macの特徴</h3>
      <p>
        Windows 10以降は「Segoe UI Emoji」、Macは「Apple Color Emoji」を使用。どちらも特殊文字のカバー範囲は広めですが、絵文字のデザインは異なります。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        表示されにくい文字の特徴
      </h2>

      <h3 className="text-lg mt-6 mb-2 font-semibold">新しいUnicode文字</h3>
      <p>
        Unicodeに追加されたばかりの文字（特に2022年以降の絵文字や特殊文字）は、古い端末では表示されないことがあります。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">マイナーな装飾文字</h3>
      <p>
        ハングル子音や数学記号など、使用頻度が低い文字は、すべてのフォントに含まれているとは限りません。例えば <code>꒰ ꒱</code>（韓国系で人気のリボン括弧）はハングル装飾文字で、機種によっては表示されないことがあります。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">バリエーションセレクタ付きの文字</h3>
      <p>
        絵文字には、ベース文字＋バリエーションセレクタという組み合わせで表現されるものがあります。これらは古い環境では分離して2文字に見えたり、片方だけ表示されたりします。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        対策・回避方法
      </h2>

      <h3 className="text-lg mt-6 mb-2 font-semibold">1. メジャーな文字を選ぶ</h3>
      <p>
        Mathematical Alphanumeric Symbols（筆記体、ダブル文字など）は古いブロックで、ほぼすべての環境でサポートされています。新しめのマイナー記号より、こうした「枯れた」文字が安全です。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">2. 複数の環境でテスト</h3>
      <p>
        自分のスマホで綺麗に見えても、友達の機種で確認してもらうのがおすすめ。家族や友人にスクショを送って確認してもらいましょう。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">3. シンプルな組み合わせに留める</h3>
      <p>
        マイナー文字を10種類盛り込むと、誰かの環境で必ず崩れます。<strong>シンプルなフォント変換＋メジャーな装飾記号</strong>に絞ると、ほとんどの環境で綺麗に見えます。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">4. 重要な情報は通常テキストで</h3>
      <p>
        プロフィールの「お問い合わせ先」「ハンドルネーム」など、伝わらないと困る情報は通常のテキストで書きましょう。装飾は「飾り」として、本質情報は機種非依存に。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        まとめ
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>機種依存文字は端末のフォントによって表示が変わる</li>
        <li>iPhoneは比較的安定、Androidは機種差が大きい</li>
        <li>マイナーな新文字より、メジャーな枯れた文字が安全</li>
        <li>重要情報は通常テキストで、装飾は装飾と割り切る</li>
      </ul>
      <p className="mt-3">
        デコ文字メーカーでは、できるだけ多くの環境で表示できる文字を中心に取り扱っています。それでも完全互換ではないので、相手のいる場面で使うときは少し気を配ると安心です。
      </p>
    </BlogLayout>
  );
}
