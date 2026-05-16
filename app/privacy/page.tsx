import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "デコ文字メーカーのプライバシーポリシーです。",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader title="プライバシーポリシー" tagline="" />

      <article
        className="bg-white rounded-2xl px-6 py-7 text-[0.95rem] leading-relaxed"
        style={{ border: "3px solid var(--color-ink)" }}
      >
        <SectionTitle>個人情報の取り扱い</SectionTitle>
        <p>
          当サイトでは、入力されたテキストはお使いの端末内（ブラウザ内）でのみ変換処理されます。
          サーバーへの送信や保存は一切行いません。
        </p>

        <SectionTitle>アクセス解析ツール</SectionTitle>
        <p>
          当サイトでは、Googleによるアクセス解析ツール「Google
          Analytics」を利用しています。
          Google Analyticsはトラフィックデータの収集のためにCookieを使用しています。
          このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
        </p>
        <p className="mt-2">
          この機能はCookieを無効にすることで収集を拒否することができます。
          詳しくは{" "}
          <a
            href="https://marketingplatform.google.com/about/analytics/terms/jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Google Analyticsサービス利用規約
          </a>
          をご確認ください。
        </p>

        <SectionTitle>広告について</SectionTitle>
        <p>
          当サイトでは、第三者配信の広告サービス（Google
          AdSense）を利用しています。
          このような広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、
          当サイトや他サイトへのアクセスに関する情報（Cookie、IPアドレス、利用したサービス等）を使用することがあります。
          ただし、これらの情報には個人を特定するものは含まれません。
        </p>
        <p className="mt-2">
          Cookieを無効にする方法やGoogle AdSenseに関する詳細は、{" "}
          <a
            href="https://policies.google.com/technologies/ads?hl=ja"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Google広告のポリシー
          </a>
          をご覧ください。
        </p>

        <SectionTitle>免責事項</SectionTitle>
        <p>
          当サイトのコンテンツや情報の正確性については万全を期しておりますが、
          利用により発生したいかなる損害についても責任を負いかねます。
          各SNSの利用規約に従ってご利用ください。
        </p>

        <SectionTitle>制定日・改定日</SectionTitle>
        <p>制定日: 2026年5月16日</p>
      </article>

      <SiteFooter />
    </>
  );
}
