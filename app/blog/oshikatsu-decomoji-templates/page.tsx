import type { Metadata } from "next";
import BlogLayout from "@/components/BlogLayout";
import { getBlogPost } from "@/lib/blog-posts";

const post = getBlogPost("oshikatsu-decomoji-templates")!;

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
        推し活をしていると、自分の「推し」への愛をプロフィールやSNSの自己紹介で表現したくなります。「私はこの推しが好きです」を、ただテキストで書くより、デコ文字で装飾するとぐっと熱量が伝わります。
      </p>
      <p className="mt-3">
        この記事では、推し活アカウントのプロフィール、自己紹介、ファンレターで使えるデコ文字テンプレートを集めました。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        推し名の装飾テンプレート
      </h2>

      <h3 className="text-lg mt-6 mb-2 font-semibold">王道ハート挟み</h3>
      <pre
        className="rounded-lg p-3 mt-2 overflow-x-auto"
        style={{
          background: "var(--color-cream)",
          border: "2px solid var(--color-pink-2)",
        }}
      >
{`♡ 推しの名前 ♡
♥︎ 推しの名前 ♥︎
❤️ 推しの名前 ❤️`}
      </pre>
      <p className="mt-2">
        どんな推しにも合う万能スタイル。色違いのハートで重ねるとさらに可愛く。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">推し色装飾</h3>
      <pre
        className="rounded-lg p-3 mt-2 overflow-x-auto"
        style={{
          background: "var(--color-cream)",
          border: "2px solid var(--color-pink-2)",
        }}
      >
{`💙 蒼くん 💙
💜 紫推し 💜
🩷 ピンク推し 🩷`}
      </pre>
      <p className="mt-2">
        推しのメンバーカラーに合わせたハート。アイドル・声優・キャラ推し全般で使えます。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">星マーク尊さ強調</h3>
      <pre
        className="rounded-lg p-3 mt-2 overflow-x-auto"
        style={{
          background: "var(--color-cream)",
          border: "2px solid var(--color-pink-2)",
        }}
      >
{`★彡 推しの名前 彡★
✦ 推しの名前 ✦
✩ 推しの名前 ✩`}
      </pre>
      <p className="mt-2">
        「光り輝く存在」感を出したいときに。アイドル系の推しと相性◎。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        プロフィール自己紹介テンプレート
      </h2>

      <h3 className="text-lg mt-6 mb-2 font-semibold">基本フォーマット</h3>
      <pre
        className="rounded-lg p-3 mt-2 overflow-x-auto text-sm"
        style={{
          background: "var(--color-cream)",
          border: "2px solid var(--color-pink-2)",
          fontFamily: "var(--font-mono-cute)",
        }}
      >
{`✧.* ♡ ✧.*
❀ 名前 ❀
☁︎ 年齢
☁︎ 推し: ○○○
☁︎ 担当: ○○
☁︎ 参戦予定: ○月○日
─────────────
FF外失礼します🙇‍♀️
DM気軽にどうぞ ♡`}
      </pre>

      <h3 className="text-lg mt-6 mb-2 font-semibold">ライブ・現場特化型</h3>
      <pre
        className="rounded-lg p-3 mt-2 overflow-x-auto text-sm"
        style={{
          background: "var(--color-cream)",
          border: "2px solid var(--color-pink-2)",
          fontFamily: "var(--font-mono-cute)",
        }}
      >
{`💜 推し名垢 💜
🎤 ○○担 / 全箱現場参戦
🎫 チケトレあり
📷 撮影OKは公開
─────────────
同担歓迎 / 同行募集中`}
      </pre>

      <h3 className="text-lg mt-6 mb-2 font-semibold">アニメ・声優垢</h3>
      <pre
        className="rounded-lg p-3 mt-2 overflow-x-auto text-sm"
        style={{
          background: "var(--color-cream)",
          border: "2px solid var(--color-pink-2)",
          fontFamily: "var(--font-mono-cute)",
        }}
      >
{`꧁ ◯◯◯◯ 担当 ꧂
✦ 声優・アニメ ✦
☆ グッズ交換可
☆ イベント参戦
☆ 同担拒否`}
      </pre>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        ファンレター・お手紙の装飾
      </h2>

      <h3 className="text-lg mt-6 mb-2 font-semibold">便箋の冒頭</h3>
      <pre
        className="rounded-lg p-3 mt-2 overflow-x-auto"
        style={{
          background: "var(--color-cream)",
          border: "2px solid var(--color-pink-2)",
        }}
      >
{`✿ ❀ ✿ ❀ ✿ ❀ ✿
推しへ
✿ ❀ ✿ ❀ ✿ ❀ ✿`}
      </pre>

      <h3 className="text-lg mt-6 mb-2 font-semibold">本文中の区切り</h3>
      <pre
        className="rounded-lg p-3 mt-2 overflow-x-auto"
        style={{
          background: "var(--color-cream)",
          border: "2px solid var(--color-pink-2)",
        }}
      >
{`⋆｡‧˚ʚ♡ɞ˚‧｡⋆
─────────────♡─────────────
✧･ﾟ: *✧･ﾟ:* * :･ﾟ✧*:･ﾟ✧`}
      </pre>

      <h3 className="text-lg mt-6 mb-2 font-semibold">結びの言葉装飾</h3>
      <pre
        className="rounded-lg p-3 mt-2 overflow-x-auto"
        style={{
          background: "var(--color-cream)",
          border: "2px solid var(--color-pink-2)",
        }}
      >
{`これからも応援しています ♡
✦ from あなたの大ファンより ✦`}
      </pre>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        ジャンル別の傾向
      </h2>

      <h3 className="text-lg mt-6 mb-2 font-semibold">2.5次元・舞台</h3>
      <p>
        役名と俳優名を併記するのが定番。「役名 with 俳優名」を ✦ で囲むと舞台っぽさが出ます。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">K-POP</h3>
      <p>
        ハングル装飾文字（꒰ ꒱ など）や、メンバーカラーの絵文字がよく使われます。グループ名→個人名の順に書くのが一般的。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">VTuber・配信者</h3>
      <p>
        コラボ箱推しの場合は箱名を冒頭に。「○○箱 / □□推し」のような表記が見られます。
      </p>

      <h3 className="text-lg mt-6 mb-2 font-semibold">バンド・ロック系</h3>
      <p>
        重厚なフラクトゥール（黒文字）や、★彡などのスター系装飾。ハートよりも☆系の方が世界観に合います。
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        推し活アカ運用のコツ
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>同担OK/拒否を明記</strong>:
          トラブル防止のために、必ずどちらか明記しましょう。
        </li>
        <li>
          <strong>FF外失礼の表記</strong>:
          推し関連のリプを送るときの慣習。プロフに記載しておくと丁寧。
        </li>
        <li>
          <strong>担当・推しの表記統一</strong>:
          ジャンル内での通例（「担」「推し」など）に合わせると馴染みやすい。
        </li>
        <li>
          <strong>推しへの愛は装飾だけでなく言葉でも</strong>:
          デコ文字だけでなく、ちゃんと自分の言葉で熱量を伝えるとより印象的。
        </li>
      </ul>

      <h2 className="text-xl mt-8 mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}>
        まとめ
      </h2>
      <p>
        推し活でデコ文字を使うのは、「推しが好き」という気持ちを目に見える形にする手段の一つです。テンプレートは出発点として、自分の推しと自分らしさが伝わるオリジナルアレンジを加えていってみてください。
      </p>
      <p className="mt-3">
        デコ文字メーカーでは、推し活で使える特殊文字や装飾フレームを多数用意しています。組み合わせて自分だけのスタイルを作りましょう。
      </p>
    </BlogLayout>
  );
}
