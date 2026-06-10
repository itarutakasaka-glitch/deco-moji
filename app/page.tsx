import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Generator from "@/components/Generator";
import Frames from "@/components/Frames";
import AdSlot from "@/components/AdSlot";
import SectionTitle from "@/components/SectionTitle";
import TipsBox from "@/components/TipsBox";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "デコ文字メーカー｜SNSプロフ・推し活で映える特殊文字ジェネレーター",
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

// 構造化データ（WebApplication）
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  inLanguage: "ja",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <Generator />

      {/* SNSパワー診断への導線 */}
      <Link
        href="/shindan"
        className="block rounded-2xl px-5 py-4 mb-6 text-center font-bold text-white"
        style={{
          background: "linear-gradient(135deg, #1d1040, #0a0618 60%, #33205e)",
          border: "2px solid var(--color-ink)",
          textShadow: "0 0 12px rgba(255,46,151,.8)",
        }}
      >
        ⚡ 新コンテンツ「SNSパワー診断」⚡
        <span className="block text-sm font-normal mt-1" style={{ color: "#B8AEE0", textShadow: "none" }}>
          名前を入れるだけ。あなたのSNS戦闘力と称号を測定 →
        </span>
      </Link>

      <AdSlot />

      <SectionTitle>⊹ 装飾フレーム集</SectionTitle>
      <p
        className="mb-3.5 text-sm"
        style={{ color: "var(--color-pink-4)" }}
      >
        タップでコピー、プロフィールの上下に挟んで使ってね
      </p>
      <Frames />

      <AdSlot />

      <TipsBox
        title="SNSで使うときのコツ"
        tips={[
          "Instagramのプロフィール名は1日に何度も変えられないので注意",
          "TikTokは特殊文字が一部表示されないことあり、事前にプレビュー確認◎",
          "Xのユーザー名（@〜）は英数字のみ。表示名はOK",
          "LINEのプロフィール名や一言にもそのまま貼り付け可能",
          "機種によっては表示できない文字あり、相手に伝わるか試してね",
        ]}
      />

      <SiteFooter />
    </>
  );
}
