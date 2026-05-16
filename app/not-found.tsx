import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <div
        className="bg-white rounded-2xl px-6 py-10 text-center my-8"
        style={{ border: "3px solid var(--color-ink)" }}
      >
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-pink-4)" }}
        >
          ページが見つかりません(´；ω；`)
        </h2>
        <p className="mb-5 text-[0.95rem]">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="inline-block rounded-full px-5 py-2.5 font-semibold"
          style={{
            border: "2px solid var(--color-ink)",
            background: "var(--color-yellow-soft)",
            color: "var(--color-ink)",
            textDecoration: "none",
          }}
        >
          ホームに戻る
        </Link>
      </div>
      <SiteFooter />
    </>
  );
}
