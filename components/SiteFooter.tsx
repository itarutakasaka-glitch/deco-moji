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
        <Link href="/shindan" className="underline-offset-4 hover:underline">
          SNSパワー診断
        </Link>
        <Link href="/kabegami" className="underline-offset-4 hover:underline">
          壁紙メーカー
        </Link>
        <Link href="/copy" className="underline-offset-4 hover:underline">
          コピペ素材集
        </Link>
        <Link href="/blog" className="underline-offset-4 hover:underline">
          ブログ
        </Link>
        <Link href="/howto" className="underline-offset-4 hover:underline">
          使い方
        </Link>
        <Link href="/about" className="underline-offset-4 hover:underline">
          運営者情報
        </Link>
        <Link href="/contact" className="underline-offset-4 hover:underline">
          お問い合わせ
        </Link>
        <Link href="/privacy" className="underline-offset-4 hover:underline">
          プライバシー
        </Link>
      </nav>
      <div>© 2026 デコ文字メーカー / made with ♡</div>
    </footer>
  );
}
