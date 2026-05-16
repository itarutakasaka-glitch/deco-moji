import type { Metadata } from "next";
import BlogLayout from "@/components/BlogLayout";
import { getBlogPost } from "@/lib/blog-posts";

const post = getBlogPost("instagram-deco-moji-patterns")!;

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
        Instagramのプロフィール欄、自己紹介、ハイライト名にデコ文字を取り入れている人をよく見かけるようになりました。シンプルな名前のプロフィールよりも、目に留まりやすく、自分の世界観を表現できるのが魅力です。
      </p>
      <p className="mt-3">
        この記事では、実際にInstagramで使われている、フォロワーに刺さりやすい人気のデコ文字パターンを15個ご紹介します。すぐにコピー＆ペーストして使えるので、気になるパターンが見つかったらぜひ試してみてください。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        ガーリー・ガールズ系（5パターン）
      </h2>

      <h3 className="text-lg mt-6 mb-2 font-semibold">1. ハート挟み</h3>
      <p>名前を♡で挟むシンプルだけど王道のスタイル。例: <code>♡ yuka ♡</code></p>
      <p className="mt-2">どんな雰囲気にも合わせやすく、初めてデコ文字を使う人にもおすすめ。ハートの数を増やしたり、♥や❤に変えると印象が変わります。</p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">2. キラキラ装飾</h3>
      <p>例: <code>⋆｡˚⋆ yuka ⋆˚｡⋆</code></p>
      <p className="mt-2">キラキラ系の記号で挟むと、夢かわ・ふんわり系の世界観に。プロフィールの上下に挟むフレームとしても使えます。</p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">3. リボン括弧</h3>
      <p>例: <code>꒰ yuka ꒱</code></p>
      <p className="mt-2">韓国系・量産型のアカウントで人気のスタイル。可愛らしさと洗練感を両立できます。</p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">4. お花マーク</h3>
      <p>例: <code>✿ yuka ✿</code> または <code>❀ yuka ❀</code></p>
      <p className="mt-2">フローラル系・ナチュラル系のアカウントにぴったり。季節感のある投稿が多い人におすすめ。</p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">5. 筆記体フォント</h3>
      <p>例: <code>𝓎𝓊𝓀𝒶</code></p>
      <p className="mt-2">名前自体を筆記体に変換するパターン。エレガントで大人っぽい印象になります。</p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        クール・モード系（5パターン）
      </h2>

      <h3 className="text-lg mt-6 mb-2 font-semibold">6. ダブル文字（中抜き）</h3>
      <p>例: <code>𝕪𝕦𝕜𝕒</code></p>
      <p className="mt-2">ファッション系・モード系アカウントで人気。クールでスタイリッシュな印象を与えます。</p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">7. ボールド斜体</h3>
      <p>例: <code>𝒚𝒖𝒌𝒂</code></p>
      <p className="mt-2">アクティブ・スポーツ系アカウントにマッチ。動きのある印象を与えるフォントです。</p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">8. しかく文字</h3>
      <p>例: <code>🅈🅄🄺🄰</code></p>
      <p className="mt-2">アート系・クリエイター系アカウントにおすすめ。ポップでありながら個性的な印象を演出。</p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">9. 全角アルファベット</h3>
      <p>例: <code>Ｙｕｋａ</code></p>
      <p className="mt-2">レトロ・Y2K感を出したいときに。90〜00年代風のテイストが好きな人に人気。</p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">10. 黒文字（フラクトゥール）</h3>
      <p>例: <code>𝔶𝔲𝔨𝔞</code></p>
      <p className="mt-2">ゴシック・ダーク系アカウント向け。中世風の重厚な雰囲気を演出します。</p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        ニッチ・上級者向け（5パターン）
      </h2>

      <h3 className="text-lg mt-6 mb-2 font-semibold">11. 肉球マーク</h3>
      <p>例: <code>୨୧ yuka ୨୧</code></p>
      <p className="mt-2">ペット好きなアカウントや、可愛さを強調したいときに。動物系アカウントの主流。</p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">12. もこもこ雲</h3>
      <p>例: <code>☁︎ yuka ☁︎</code></p>
      <p className="mt-2">ふんわり・ゆるふわ系の世界観に。優しい印象を与える装飾です。</p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">13. キラ盛り</h3>
      <p>例: <code>✩°｡⋆⸜ yuka ⸝⋆｡°✩</code></p>
      <p className="mt-2">夢かわ系・地雷系・量産型などで使われる「盛り盛り」スタイル。インパクト重視のときに。</p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">14. すきま空け</h3>
      <p>例: <code>y u k a</code></p>
      <p className="mt-2">文字の間にスペースを入れるだけのシンプルなテクニック。洗練感や余白の美しさを表現できます。</p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">15. ちいさめ大文字</h3>
      <p>例: <code>ʏᴜᴋᴀ</code></p>
      <p className="mt-2">小さく見える特殊な大文字。控えめながらおしゃれな印象を演出。サブカル系アカウントに人気。</p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        Instagramで使うときの注意点
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>ユーザー名（@〜）には使えません</strong>:
          特殊文字が使えるのは「表示名」「自己紹介（bio）」「ハイライト名」のみです。
        </li>
        <li>
          <strong>プロフィール名は1日に何度も変更できません</strong>:
          短期間に何度も変えるとロックがかかることがあります。じっくり選んでから設定しましょう。
        </li>
        <li>
          <strong>機種によっては表示されない場合があります</strong>:
          特に古いAndroid端末では「□」のように表示される文字があります。
        </li>
      </ul>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        まとめ
      </h2>
      <p>
        15個のデコ文字パターンをご紹介しました。アカウントのコンセプトや投稿のテイストに合わせて、自分らしいスタイルを見つけてみてください。
      </p>
      <p className="mt-3">
        デコ文字メーカーでは、これら以外にも様々なフォントスタイルを用意しています。気軽に試して、お気に入りを見つけましょう。
      </p>
    </BlogLayout>
  );
}
