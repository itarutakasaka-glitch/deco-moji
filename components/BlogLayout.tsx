import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdSlot from "@/components/AdSlot";
import type { BlogPost } from "@/lib/blog-posts";

type Props = {
  post: BlogPost;
  children: React.ReactNode;
};

export default function BlogLayout({ post, children }: Props) {
  return (
    <>
      <SiteHeader title="ブログ" tagline="デコ文字メーカーの読み物" />

      <article
        className="bg-white rounded-2xl px-6 py-7"
        style={{ border: "3px solid var(--color-ink)" }}
      >
        {/* パンくず */}
        <nav
          className="text-sm mb-4"
          style={{ color: "var(--color-pink-4)" }}
        >
          <Link href="/" className="underline-offset-4 hover:underline">
            ホーム
          </Link>
          {" › "}
          <Link href="/blog" className="underline-offset-4 hover:underline">
            ブログ
          </Link>
          {" › "}
          <span>{post.category}</span>
        </nav>

        {/* タイトル */}
        <header className="mb-6">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{
              background: "var(--color-yellow-soft)",
              color: "var(--color-ink)",
              border: "2px solid var(--color-ink)",
            }}
          >
            {post.emoji} {post.category}
          </div>
          <h1
            className="text-2xl sm:text-3xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-pink-4)",
              lineHeight: "1.4",
            }}
          >
            {post.title}
          </h1>
          <time
            className="block mt-3 text-xs"
            style={{ color: "var(--color-pink-4)" }}
          >
            公開日: {post.publishedAt}
          </time>
        </header>

        {/* 本文 */}
        <div
          className="blog-content text-[0.95rem] leading-relaxed"
          style={{ color: "var(--color-ink)" }}
        >
          {children}
        </div>

        {/* 関連ツール */}
        <div
          className="mt-10 rounded-2xl p-5"
          style={{
            background: "var(--color-cream)",
            border: "2px dashed var(--color-pink-3)",
          }}
        >
          <p
            className="text-sm font-semibold mb-2"
            style={{ color: "var(--color-pink-4)" }}
          >
            ✦ この記事で紹介したデコ文字を実際に作ってみよう
          </p>
          <Link
            href="/"
            className="inline-block rounded-full px-5 py-2.5 font-semibold mt-1"
            style={{
              border: "2px solid var(--color-ink)",
              background: "var(--color-yellow-soft)",
              color: "var(--color-ink)",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            → デコ文字メーカーを使う
          </Link>
        </div>
      </article>

      <AdSlot />

      <SiteFooter />
    </>
  );
}
