import type { Metadata } from "next";
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
