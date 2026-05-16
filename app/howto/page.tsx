import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "デコ文字メーカーの使い方｜SNSプロフを盛る完全ガイド",
  description:
    "デコ文字メーカーの基本的な使い方、各SNSでの活用法、機種別の表示の違い、よくある質問まで網羅した完全ガイド。",
  alternates: { canonical: "/howto" },
};

export default function HowtoPage() {
  return (
    <>
      <SiteHeader title="使い方ガイド" tagline="デコ文字をSNSで使うコツ全部" />

      <article
        className="bg-white rounded-2xl px-6 py-7"
        style={{ border: "3px solid var(--color-ink)" }}
      >
        <SectionTitle>基本の使い方</SectionTitle>
        <ol className="list-decimal pl-6 space-y-2 text-[0.95rem]">
          <li>トップページの入力欄に変換したい文字を入力（例: yourname）</li>
          <li>たくさんのフォントスタイルに自動変換されて一覧表示されます</li>
          <li>気に入ったスタイルの「コピー」ボタンをタップ</li>
          <li>InstagramやTikTok、Xのプロフィール欄にペースト</li>
          <li>装飾フレームを上下に挟むとさらに盛れます</li>
        </ol>

        <SectionTitle>カテゴリの選び方</SectionTitle>
        <ul className="list-disc pl-6 space-y-2 text-[0.95rem]">
          <li>
            <strong>かわいい</strong>: 筆記体、まる文字、しかく文字、全角など。
            ガーリーや女の子っぽいプロフィールに
          </li>
          <li>
            <strong>クール</strong>: 黒文字（フラクトゥール）、ダブル文字、等幅、サンセリフ太字など。
            シンプル・スタイリッシュ系に
          </li>
          <li>
            <strong>枠付き</strong>: ハート、リボン、キラキラなどで文字を囲む装飾
          </li>
          <li>
            <strong>ちいさめ</strong>: 上付き・下付き文字、small
            capitals。控えめでオシャレ
          </li>
        </ul>

        <SectionTitle>機種・端末による表示の違い</SectionTitle>
        <p className="text-[0.95rem] mb-3">
          特殊文字は <strong>Unicode</strong>{" "}
          という国際規格で定義されていますが、すべての端末で同じように表示されるとは限りません。
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[0.95rem]">
          <li>iPhone（iOS）: ほとんどのスタイルが綺麗に表示</li>
          <li>Android: 機種・OSバージョンによっては一部の文字が□（豆腐）に</li>
          <li>
            Windows PC:
            ブラウザ表示は問題ないが、古いソフトで貼り付けると崩れる場合あり
          </li>
          <li>古い機種で見ている友達には伝わらないこともあるので注意</li>
        </ul>

        <SectionTitle>SNS別の活用ページ</SectionTitle>
        <ul className="list-disc pl-6 space-y-2 text-[0.95rem]">
          <li>
            <Link href="/instagram" className="underline">
              Instagram向けデコ文字ページ
            </Link>
            : インスタプロフ・自己紹介・ハイライト名用
          </li>
          <li>
            <Link href="/tiktok" className="underline">
              TikTok向けデコ文字ページ
            </Link>
            : TikTok表示名・自己紹介用
          </li>
          <li>
            <Link href="/x" className="underline">
              X（旧Twitter）向けデコ文字ページ
            </Link>
            : X表示名・bio・ポスト用
          </li>
        </ul>

        <SectionTitle>よくある質問</SectionTitle>
        <dl className="space-y-4 text-[0.95rem]">
          <div>
            <dt className="font-semibold" style={{ color: "var(--color-pink-4)" }}>
              Q. なんで一部の文字が表示されないの？
            </dt>
            <dd className="mt-1">
              A.
              特殊文字はUnicodeフォントに依存します。古い端末や一部のフォントだと未対応のため□に見えることがあります。
              貼り付け先の環境で実際に表示されるか確認するのがおすすめです。
            </dd>
          </div>
          <div>
            <dt className="font-semibold" style={{ color: "var(--color-pink-4)" }}>
              Q. ユーザー名（@〜）には使える？
            </dt>
            <dd className="mt-1">
              A.
              いいえ。Instagram・X・TikTokなど主要SNSのユーザー名は半角英数字とアンダースコアのみ対応です。
              特殊文字は<strong>表示名・自己紹介・bio</strong>欄で使ってください。
            </dd>
          </div>
          <div>
            <dt className="font-semibold" style={{ color: "var(--color-pink-4)" }}>
              Q. コピーできない時は？
            </dt>
            <dd className="mt-1">
              A.
              ブラウザが古い場合、クリップボード機能が動かないことがあります。
              最新のChrome、Safari、Edgeなどで開き直してみてください。
            </dd>
          </div>
          <div>
            <dt className="font-semibold" style={{ color: "var(--color-pink-4)" }}>
              Q. 利用は無料？
            </dt>
            <dd className="mt-1">
              A. 完全無料です。会員登録も不要、何回でも使えます。
            </dd>
          </div>
        </dl>
      </article>

      <SiteFooter />
    </>
  );
}
