import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Generator from "@/components/Generator";
import Frames from "@/components/Frames";
import AdSlot from "@/components/AdSlot";
import SectionTitle from "@/components/SectionTitle";
import TipsBox from "@/components/TipsBox";

type Props = {
  h1: string;
  intro: string;
  tipTitle: string;
  tips: string[];
  defaultText?: string;
};

export default function SnsPageTemplate({
  h1,
  intro,
  tipTitle,
  tips,
  defaultText = "kawaii",
}: Props) {
  return (
    <>
      <SiteHeader title={h1} tagline="盛れる特殊文字をワンタップでコピー" />

      <div
        className="rounded-2xl bg-white px-5 py-4 mb-6 text-[0.95rem]"
        style={{ border: "2px solid var(--color-ink)" }}
      >
        {intro}
      </div>

      <Generator defaultText={defaultText} />

      <AdSlot />

      <SectionTitle>⊹ 装飾フレーム集</SectionTitle>
      <p className="mb-3.5 text-sm" style={{ color: "var(--color-pink-4)" }}>
        タップでコピー、プロフィールの上下に挟んで使ってね
      </p>
      <Frames />

      <AdSlot />

      <TipsBox title={tipTitle} tips={tips} />

      <SiteFooter />
    </>
  );
}
