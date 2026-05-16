import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { blogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "ブログ｜デコ文字メーカー",
  description:
    "デコ文字・特殊文字に関する読み物、SNS別の活用テクニック、推し活で使えるテンプレートなどを発信しています。",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <>
      <SiteHeader title="ブログ" tagline="デコ文字メーカーの読み物" />

      <div
        className="rounded-2xl bg-white px-5 py-4 mb-6 text-[0.95rem]"
        style={{ border: "2px solid var(--color-ink)" }}
      >
        デコ文字・特殊文字に関する読み物、SNS別の活用ガイド、推し活で使えるテンプレートなどをご紹介しています。
      </div>

      <div className="grid gap-3">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="rounded-2xl bg-white px-5 py-4 block shadow-cute-hover no-underline"
            style={{
              border: "2px solid var(--color-ink)",
              color: "var(--color-ink)",
            }}
          >
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2"
              style={{
                background: "var(--color-yellow-soft)",
                color: "var(--color-ink)",
                border: "2px solid var(--color-ink)",
              }}
            >
              {post.emoji} {post.category}
            </div>
            <h2
              className="text-lg sm:text-xl mb-1"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-pink-4)",
                lineHeight: "1.4",
              }}
            >
              {post.title}
            </h2>
            <p className="text-sm mt-2" style={{ color: "var(--color-ink)" }}>
              {post.description}
            </p>
            <time
              className="block mt-2 text-xs"
              style={{ color: "var(--color-pink-4)" }}
            >
              {post.publishedAt}
            </time>
          </Link>
        ))}
      </div>

      <SiteFooter />
    </>
  );
}
