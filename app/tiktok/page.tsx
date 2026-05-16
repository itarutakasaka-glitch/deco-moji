import type { Metadata } from "next";
import SnsPageTemplate from "@/components/SnsPageTemplate";
import { landingPages } from "@/lib/site-config";

const page = landingPages.find((p) => p.slug === "tiktok")!;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/tiktok" },
  openGraph: {
    title: page.title,
    description: page.description,
    url: "/tiktok",
  },
};

export default function TikTokPage() {
  return (
    <SnsPageTemplate
      h1={page.h1}
      intro={page.intro}
      tipTitle={page.tipTitle}
      tips={page.tips}
      defaultText="oshikatsu"
    />
  );
}
