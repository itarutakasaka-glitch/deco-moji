import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "運営者情報｜デコ文字メーカー",
  description:
    "デコ文字メーカーの運営者情報、運営理念、サイトの目的についてご紹介します。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader title="運営者情報" tagline="このサイトについて" />

      <article
        className="bg-white rounded-2xl px-6 py-7 text-[0.95rem] leading-relaxed"
        style={{ border: "3px solid var(--color-ink)" }}
      >
        <SectionTitle>サイトについて</SectionTitle>
        <p>
          「デコ文字メーカー」は、Instagram・TikTok・X（旧Twitter）などのSNSプロフィール、推し活、ハンドメイド作品の名入れ、コメント装飾などで使える特殊文字（デコ文字）を、ワンタップでコピー＆ペーストできる無料ツールサイトです。
        </p>
        <p className="mt-3">
          Unicodeで定義された数千種類の文字の中から、特に「かわいい」「映える」「装飾性が高い」ものを厳選し、用途別・スタイル別に整理してお届けしています。
        </p>

        <SectionTitle>運営者情報</SectionTitle>
        <dl className="space-y-3">
          <div>
            <dt className="font-semibold" style={{ color: "var(--color-pink-4)" }}>
              サイト名
            </dt>
            <dd>デコ文字メーカー</dd>
          </div>
          <div>
            <dt className="font-semibold" style={{ color: "var(--color-pink-4)" }}>
              運営
            </dt>
            <dd>デコ文字メーカー運営チーム</dd>
          </div>
          <div>
            <dt className="font-semibold" style={{ color: "var(--color-pink-4)" }}>
              ドメイン
            </dt>
            <dd>decomoji.xyz</dd>
          </div>
          <div>
            <dt className="font-semibold" style={{ color: "var(--color-pink-4)" }}>
              開設日
            </dt>
            <dd>2026年5月</dd>
          </div>
          <div>
            <dt className="font-semibold" style={{ color: "var(--color-pink-4)" }}>
              連絡先
            </dt>
            <dd>
              お問い合わせは{" "}
              <a href="/contact" className="underline">
                お問い合わせページ
              </a>
              からお願いします。
            </dd>
          </div>
        </dl>

        <SectionTitle>運営理念</SectionTitle>
        <p>
          SNSが日常になった今、自分の個性を文字でも表現したい人が増えています。しかし、特殊文字を扱うサイトの多くは、英語圏発で日本語UIが分かりにくかったり、広告が過剰でツールとして使いにくかったりするものが多いのが現状です。
        </p>
        <p className="mt-3">
          デコ文字メーカーは、<strong>日本語ユーザーが気軽に使える、ストレスのない特殊文字ツール</strong>を目指して制作しました。
          ワンタップでコピーできる手軽さ、SNS別の活用ガイド、機種依存への配慮など、実際に使う人の視点で設計しています。
        </p>

        <SectionTitle>提供しているコンテンツ</SectionTitle>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>フォント変換ツール</strong>: 入力テキストを20種類以上のスタイルに自動変換
          </li>
          <li>
            <strong>装飾フレーム集</strong>: プロフィールの装飾に使える区切り線・フレーム
          </li>
          <li>
            <strong>SNS別ガイド</strong>: Instagram・TikTok・Xでの最適な使い方
          </li>
          <li>
            <strong>使い方ブログ</strong>: 機種依存や活用テクニックの解説記事
          </li>
        </ul>

        <SectionTitle>更新情報</SectionTitle>
        <p>
          利用者のフィードバックや新しい流行に応じて、機能・スタイル・記事を継続的に追加していきます。
          「こんなスタイルが欲しい」「このSNSで使いたい」などのご要望は、
          <a href="/contact" className="underline">
            お問い合わせ
          </a>
          からお寄せください。
        </p>

        <SectionTitle>免責事項</SectionTitle>
        <p>
          当サイトの情報は、利用者の利便性のために提供されていますが、すべての環境での表示・動作を保証するものではありません。
          特殊文字はUnicodeに準拠していますが、機種・OS・アプリ・フォントによっては正しく表示されない場合があります。
        </p>
        <p className="mt-3">
          各SNSのご利用にあたっては、それぞれの利用規約をご確認の上、責任を持ってご利用ください。
        </p>
      </article>

      <SiteFooter />
    </>
  );
}
