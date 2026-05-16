import type { Metadata } from "next";
import SnsPageTemplate from "@/components/SnsPageTemplate";
import { landingPages } from "@/lib/site-config";

const page = landingPages.find((p) => p.slug === "instagram")!;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/instagram" },
  openGraph: {
    title: page.title,
    description: page.description,
    url: "/instagram",
  },
};

export default function InstagramPage() {
  return (
    <SnsPageTemplate
      h1={page.h1}
      intro={page.intro}
      tipTitle={page.tipTitle}
      tips={page.tips}
      defaultText="cutie"
    />
  );
}
