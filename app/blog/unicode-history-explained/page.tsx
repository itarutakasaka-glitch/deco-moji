import type { Metadata } from "next";
import BlogLayout from "@/components/BlogLayout";
import { getBlogPost } from "@/lib/blog-posts";

const post = getBlogPost("unicode-history-explained")!;

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
        筆記体やまる文字をコピーしてInstagramやXに貼り付けると、なぜか画像でもないのにそのまま装飾された文字として表示されます。これは魔法ではなく、「Unicode」という国際規格の仕組みのおかげです。
      </p>
      <p className="mt-3">
        この記事では、特殊文字とUnicodeの関係を、技術的な難しさは抜きにしてわかりやすく解説します。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        そもそも「特殊文字」とは
      </h2>
      <p>
        私たちが普段使う文字（あ、A、1など）以外の、装飾的・記号的な文字を総称して「特殊文字」と呼びます。例えば:
      </p>
      <ul className="list-disc pl-6 space-y-1 mt-3">
        <li>筆記体: 𝓐𝓑𝓒𝓓</li>
        <li>まる文字: ⒶⒷⒸⒹ</li>
        <li>ハート: ♡ ♥ ❤</li>
        <li>装飾記号: ✦ ✧ ✨ ❀</li>
        <li>顔文字パーツ: ꒰ ꒱ ◕ ◡</li>
      </ul>
      <p className="mt-3">
        これらはすべて「文字コード」が割り当てられており、テキストとして扱える「文字」なのです。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        Unicodeとは何か
      </h2>
      <p>
        Unicode（ユニコード）は、世界中の文字に共通の番号を割り振った国際規格です。1991年に最初のバージョンが公開され、現在も毎年新しい文字が追加されています。
      </p>
      <p className="mt-3">
        Unicodeの最大のメリットは、「同じ文字には同じ番号が割り振られている」ことです。これにより、iPhoneで打った文字をAndroidに送っても、Windowsに送っても、原則として同じように表示されます。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">Unicode誕生前の混乱</h3>
      <p>
        Unicode以前は、国や地域ごとに独自の文字コード体系がありました。日本ではShift_JIS、JIS、EUC-JPなど。海外ではISO-8859系。これらは互換性がなく、ファイルを別の環境で開くと「文字化け」が起きていました。
      </p>
      <p className="mt-3">
        絵文字も、もともとはNTTドコモが1999年に日本の携帯電話向けに作ったものでしたが、各キャリアごとに違うコードを使っていたため、auのユーザーにドコモから送ると別の絵文字に化ける、ということが起きていました。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">Unicodeに統合される</h3>
      <p>
        2010年、Unicodeに絵文字が正式に追加されました。これにより、iPhone、Android、Windows、Macなど、どの環境でも同じ絵文字が共有できるようになったのです。
      </p>
      <p className="mt-3">
        現在のUnicodeには、なんと約15万文字以上が登録されています。漢字・仮名・アルファベットだけでなく、絵文字、数学記号、特殊な装飾文字、消滅した古代文字まで含まれています。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        デコ文字に使われる文字の正体
      </h2>

      <h3 className="text-lg mt-6 mb-2 font-semibold">Mathematical Alphanumeric Symbols</h3>
      <p>
        筆記体やダブル文字（中抜き）の正体は、Unicodeの「Mathematical Alphanumeric Symbols」というブロックにある文字です。本来は数学者が数式で変数や定数を表すために使う文字でした。
      </p>
      <p className="mt-3">
        例えば <code>𝒜</code>（イタリック体のA）は、数学では「ある集合」を表す記号として使われます。これがUnicodeに登録されているため、SNSのテキストフィールドにも入力できるのです。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">Enclosed Alphanumerics</h3>
      <p>
        まる文字（Ⓐ Ⓑ Ⓒ）は「Enclosed Alphanumerics」というブロック。これも本来は技術文書で項目番号などに使うためのものです。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">Halfwidth and Fullwidth Forms</h3>
      <p>
        全角アルファベット（Ａ Ｂ Ｃ）は「Halfwidth and Fullwidth Forms」。日本語の組版で漢字と幅を揃えるために必要な文字です。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">本来の用途と異なる使い方</h3>
      <p>
        つまり、私たちが「デコ文字」として楽しんでいる文字は、もともとは数学者や技術者がそれぞれの専門分野で必要だったから登録された文字なのです。
      </p>
      <p className="mt-3">
        それが2010年代後半から、SNS文化の中で「装飾用」として転用されるようになりました。本来の意図とは違う使い方ですが、Unicodeの「すべての文字に番号を」という思想のおかげで、誰でも自由に使えるようになっています。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        まとめ
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>特殊文字はUnicodeに登録された正式な文字</li>
        <li>本来は数学・技術用途のために登録された文字が多い</li>
        <li>Unicodeのおかげで端末を問わず使える（ただし完全互換ではない）</li>
        <li>SNS文化が新しい用途を生み出している</li>
      </ul>
      <p className="mt-3">
        次にデコ文字をコピーして使うとき、その背後にUnicode規格や数学者たちの仕事があると思うと、ちょっと面白いかもしれません。
      </p>
    </BlogLayout>
  );
}
