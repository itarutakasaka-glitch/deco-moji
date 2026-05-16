import Link from "next/link";

export default function SiteHeader({
  title = "デコ文字メーカー",
  tagline = "SNSプロフ・推し活が映える♡ 特殊文字ジェネレーター",
}: {
  title?: string;
  tagline?: string;
}) {
  return (
    <header className="text-center px-4 pt-8 pb-4 relative">
      <Link href="/" className="inline-block no-underline">
        <h1
          className="inline-block tracking-wider"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 6vw, 3.4rem)",
            color: "var(--color-pink-4)",
            transform: "rotate(-2deg)",
            textShadow:
              "3px 3px 0 var(--color-yellow-soft), 6px 6px 0 var(--color-lav-2)",
            margin: 0,
          }}
        >
          {title} <span className="animate-sparkle">✦</span>
        </h1>
      </Link>
      <div
        className="inline-block mt-2 text-xl"
        style={{
          fontFamily: "var(--font-script)",
          color: "var(--color-pink-3)",
          transform: "rotate(1deg)",
        }}
      >
        {tagline}
      </div>
    </header>
  );
}
