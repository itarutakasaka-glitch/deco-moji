import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "お問い合わせ｜デコ文字メーカー",
  description:
    "デコ文字メーカーへのご質問・ご要望・不具合報告などのお問い合わせはこちらから。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader title="お問い合わせ" tagline="ご意見・ご要望はこちら" />

      <article
        className="bg-white rounded-2xl px-6 py-7 text-[0.95rem] leading-relaxed"
        style={{ border: "3px solid var(--color-ink)" }}
      >
        <SectionTitle>お問い合わせの前に</SectionTitle>
        <p>
          デコ文字メーカーへのお問い合わせをご検討いただきありがとうございます。
          よくあるご質問は、
          <a href="/howto" className="underline">
            使い方ガイド
          </a>
          で多くお答えしています。先にそちらをご確認いただけるとスムーズです。
        </p>

        <SectionTitle>お問い合わせの種類</SectionTitle>
        <p>当サイトでは、以下のお問い合わせを受け付けています:</p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>新しいフォントスタイルの追加リクエスト</li>
          <li>使い方に関するご質問</li>
          <li>不具合・表示崩れの報告</li>
          <li>掲載内容に関するご指摘</li>
          <li>サイト改善のご提案</li>
          <li>取材・掲載のご相談</li>
        </ul>

        <SectionTitle>お問い合わせ方法</SectionTitle>
        <p>
          下記のメールアドレスまでご連絡ください。内容を確認の上、原則として1週間以内にご返信いたします。
        </p>

        <div
          className="rounded-2xl mt-4 px-5 py-4 text-center"
          style={{
            background: "var(--color-cream)",
            border: "2px solid var(--color-ink)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--color-pink-4)" }}>
            ▼ お問い合わせメールアドレス
          </p>
          <p
            className="text-lg font-semibold mt-1"
            style={{
              fontFamily: "var(--font-mono-cute)",
              color: "var(--color-ink)",
            }}
          >
            contact [at] decomoji.xyz
          </p>
          <p
            className="text-xs mt-2"
            style={{ color: "var(--color-pink-4)" }}
          >
            ※ スパム対策のため [at] は @ に置き換えてください
          </p>
        </div>

        <SectionTitle>お問い合わせ時のお願い</SectionTitle>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>不具合報告の場合</strong>:
            お使いの端末・ブラウザ・OS（例: iPhone Safari、Windows
            Chromeなど）と、発生した状況を詳しくお書きください。
          </li>
          <li>
            <strong>スタイル追加リクエスト</strong>:
            参考になるサイトや、どんな雰囲気のスタイルが欲しいかを具体的にお書きいただけると、検討がスムーズです。
          </li>
          <li>
            <strong>返信について</strong>:
            内容によっては返信できない場合や、お時間をいただく場合があります。あらかじめご了承ください。
          </li>
          <li>
            <strong>営業・広告掲載のお問い合わせ</strong>:
            現在、第三者からの広告掲載依頼は受け付けておりません。Google
            AdSense経由の広告のみ掲載しています。
          </li>
        </ul>

        <SectionTitle>個人情報の取り扱い</SectionTitle>
        <p>
          お問い合わせいただいた際の個人情報（メールアドレス、お名前など）は、お問い合わせへの返信目的のみに使用し、第三者への提供は行いません。
          詳しくは
          <a href="/privacy" className="underline">
            プライバシーポリシー
          </a>
          をご確認ください。
        </p>
      </article>

      <SiteFooter />
    </>
  );
}
