import type { Metadata } from "next";
import BlogLayout from "@/components/BlogLayout";
import { getBlogPost } from "@/lib/blog-posts";

const post = getBlogPost("tiktok-special-fonts-guide")!;

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
        TikTokのプロフィールや動画キャプションで、目を引く表示名や凝った装飾を見かけることが増えました。実はあれ、ほとんどがUnicodeで定義された「特殊文字」を組み合わせて作られています。
      </p>
      <p className="mt-3">
        この記事では、TikTokで映える特殊文字の選び方、ジャンル別のおすすめ、実際の使い方を完全ガイドします。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        TikTokでの特殊文字活用シーン
      </h2>
      <p>TikTokでは、以下の3か所で特殊文字を使えます:</p>
      <ul className="list-disc pl-6 space-y-2 mt-3">
        <li>
          <strong>表示名（ニックネーム）</strong>:
          プロフィールに表示される名前。一番目立つので装飾効果大。
        </li>
        <li>
          <strong>自己紹介（bio）</strong>:
          80文字までの自己紹介欄。改行も使える。
        </li>
        <li>
          <strong>動画キャプション・コメント</strong>:
          動画下のテキストやコメント欄でも使用可能。
        </li>
      </ul>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        ジャンル別おすすめスタイル
      </h2>

      <h3 className="text-lg mt-6 mb-2 font-semibold">ダンス・歌い手系</h3>
      <p>動きのある印象を与えるボールド系フォントがおすすめ。</p>
      <p className="mt-2">例: <code>𝙼𝙸𝙺𝙰</code> / <code>𝑴𝒊𝒌𝒂</code></p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">メイク・美容系</h3>
      <p>エレガントな筆記体や、ハート装飾が映えます。</p>
      <p className="mt-2">例: <code>♡ 𝓜𝒾𝓀𝒶 ♡</code></p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">ペット・動物系</h3>
      <p>肉球マークや動物関連の絵文字を組み合わせるのが定番。</p>
      <p className="mt-2">例: <code>୨୧ Mika ୨୧</code></p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">アニメ・ゲーム系</h3>
      <p>ファンタジー感のあるフラクトゥールや、囲み記号が人気。</p>
      <p className="mt-2">例: <code>꧁ 𝔐𝔦𝔨𝔞 ꧂</code></p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">海外向け・英語コンテンツ</h3>
      <p>英語圏で人気のシンプルな筆記体やラインアクセント。</p>
      <p className="mt-2">例: <code>𝓜𝓲𝓴𝓪 ★</code></p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        TikTok特有の注意点
      </h2>

      <h3 className="text-lg mt-6 mb-2 font-semibold">1. 一部の特殊文字が表示されない</h3>
      <p>
        TikTokアプリのバージョンや端末によっては、Unicodeの一部の文字が「□」（豆腐文字）で表示されることがあります。設定する前に、必ずプレビュー画面で確認してください。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">2. ユーザー名は別物</h3>
      <p>
        @から始まる「ユーザー名」は英数字とアンダースコア、ピリオドのみ。特殊文字は使えません。装飾できるのは「表示名」です。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">3. 検索性が下がる</h3>
      <p>
        表示名を特殊文字にすると、通常の検索で見つかりにくくなる可能性があります。検索流入を重視するアカウントは、bio部分に通常テキストの名前も入れておくのがおすすめ。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">4. 名前変更の頻度制限</h3>
      <p>
        TikTokではユーザー名は30日に1回、表示名は7日に1回しか変更できません。じっくり考えてから設定しましょう。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        bioを盛るテクニック
      </h2>
      <p>表示名だけでなく、bioも特殊文字で装飾するとプロフィール全体が華やかになります。例えば:</p>

      <pre
        className="rounded-lg p-4 mt-3 text-sm overflow-x-auto"
        style={{
          background: "var(--color-cream)",
          border: "2px solid var(--color-pink-2)",
          fontFamily: "var(--font-mono-cute)",
        }}
      >
{`✿ 17歳・JK ✿
♡ 大阪 → 東京
☁︎ 推し活アカ
─────────────
DM返信は気まぐれ`}
      </pre>

      <p className="mt-3">
        このように、絵文字＋特殊記号＋区切り線を組み合わせると、情報が整理されて見やすくなります。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        まとめ
      </h2>
      <p>
        TikTokで特殊文字を使うときは、「自分のコンテンツのジャンルに合うか」「機種で正しく表示されるか」「検索性を損なわないか」の3点を意識すると失敗しません。
      </p>
      <p className="mt-3">
        デコ文字メーカーの「TikTok用ページ」では、TikTok向けに最適化された特殊文字スタイルを集めています。実際に試して、フォロワーが増えるプロフィールを作りましょう。
      </p>
    </BlogLayout>
  );
}
