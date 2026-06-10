import type { Metadata } from "next";
import Link from "next/link";
import Shindan from "@/components/Shindan";
import "./shindan.css";

export const metadata: Metadata = {
  title: "SNSパワー診断⚡名前だけであなたのSNS戦闘力と称号を測定",
  description:
    "名前を入れるだけでSNS戦闘力・レアリティ（N/R/SR/SSR/UR）・称号がわかる無料診断。X・Instagram・TikTok対応。結果の称号は特殊文字つきでそのままプロフに貼れる！",
  alternates: { canonical: "/shindan" },
  openGraph: {
    title: "SNSパワー診断⚡あなたのSNS戦闘力は？",
    description:
      "名前だけでSNS戦闘力と称号を測定。レアリティN〜UR、キミは何が出る？",
    url: "/shindan",
  },
  twitter: {
    card: "summary_large_image",
    title: "SNSパワー診断⚡あなたのSNS戦闘力は？",
    description:
      "名前だけでSNS戦闘力と称号を測定。レアリティN〜UR、キミは何が出る？",
  },
};

export default function ShindanPage() {
  return (
    <>
      <Shindan />
      <div className="sd-root" style={{ minHeight: "auto" }}>
        <section className="sd-about">
          <h2>SNSパワー診断とは？</h2>
          <p>
            名前（ハンドルネーム）を入れるだけで、あなたの「SNS戦闘力」を測定する無料の診断コンテンツです。
            結果はレアリティ（N / R / SR / SSR / UR）つきのパワーカードで表示され、
            拡散力・映え力・バズ運・推し愛・夜行性・民度の6つのステータスと、
            あなただけの称号が発行されます。診断は同じ名前なら何度やっても同じ結果になるので、
            友達やフォロワーと戦闘力を比べて遊べます。
          </p>
          <h2>結果の称号はプロフに貼れる</h2>
          <p>
            診断で発行される称号は、特殊文字の装飾フレームつき。「称号をコピー」ボタンから
            そのままXやInstagram、TikTokのプロフィールに貼り付けられます。
            もっと自分好みに飾りたい人は、
            <Link href="/">デコ文字メーカー</Link>
            で23種類以上のフォント変換と装飾フレームが使えます。
          </p>
          <h2>診断のしくみとプライバシー</h2>
          <p>
            入力した名前から決定論的に結果を計算しているため、占いというより「おみくじ」に近い遊びです。
            入力内容はすべてブラウザの中だけで処理され、サーバーに送信・保存されることはありません。
            安心して遊んでください。診断結果のシェアは
            <Link href="/x">X（旧Twitter）</Link>・
            <Link href="/instagram">Instagram</Link>・
            <Link href="/tiktok">TikTok</Link>
            それぞれの使い方ページも参考にどうぞ。
          </p>
        </section>
      </div>
    </>
  );
}
