import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer
      className="text-center px-4 py-8 text-sm"
      style={{ color: "var(--color-pink-4)" }}
    >
      <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-3">
        <Link href="/" className="underline-offset-4 hover:underline">
          ホーム
        </Link>
        <Link href="/instagram" className="underline-offset-4 hover:underline">
          Instagram
        </Link>
        <Link href="/tiktok" className="underline-offset-4 hover:underline">
          TikTok
        </Link>
        <Link href="/x" className="underline-offset-4 hover:underline">
          X
        </Link>
        <Link href="/howto" className="underline-offset-4 hover:underline">
          使い方
        </Link>
        <Link href="/privacy" className="underline-offset-4 hover:underline">
          プライバシー
        </Link>
      </nav>
      <div>© 2026 デコ文字メーカー / made with ♡</div>
    </footer>
  );
}
