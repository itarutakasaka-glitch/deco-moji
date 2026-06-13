import type { Metadata } from "next";
import Link from "next/link";
import Compatibility from "@/components/Compatibility";
import "./compatibility.css";

export const metadata: Metadata = {
  title: "デコ文字相性診断💞名前でわかる相性％＆コピペできるデコ文字メッセージ",
  description:
    "ふたりの名前を入れるだけで相性％がわかる無料診断。結果にはそのままプロフやひとことに貼れるデコ文字メッセージ付き。同じ組み合わせなら何度でも同じ結果（順番は不問）。Xでシェアして盛り上がろう。",
  alternates: { canonical: "/compatibility" },
  openGraph: {
    title: "デコ文字相性診断💞名前でわかる相性％",
    description:
      "ふたりの名前で相性％を診断。コピペできるデコ文字メッセージ付き。Xでシェアできる無料診断。",
    url: "/compatibility",
  },
  twitter: {
    card: "summary_large_image",
    title: "デコ文字相性診断💞名前でわかる相性％",
    description: "ふたりの名前で相性％を診断。デコ文字メッセージ付きの無料診断。",
  },
};

export default function CompatibilityPage() {
  return (
    <>
      <Compatibility />
      <div className="cp-root" style={{ minHeight: "auto" }}>
        <section className="cp-about">
          <h2>デコ文字相性診断とは？</h2>
          <p>
            デコ文字相性診断は、あなたとお相手の名前（ニックネーム）を入れるだけで、
            ふたりの相性％・相性タイプ・ひとことアドバイスがわかる無料の診断コンテンツです。
            結果には、そのままSNSのプロフィールやひとことに貼れる特殊文字（デコ文字）の
            メッセージが付いてきます。もっと自分好みに飾りたいときは
            <Link href="/">デコ文字メーカー</Link>
            で23種類以上のフォント変換と装飾フレームが使えます。
          </p>
          <h2>診断のしくみとプライバシー</h2>
          <p>
            結果は名前の組み合わせから決定論的に計算する「おみくじ」型のエンターテインメントです。
            同じ組み合わせなら何度試しても同じ結果になり、入れる順番は関係ありません。
            入力した名前はすべてブラウザの中だけで処理され、サーバーに送信・保存されることはありません。
            ほかの診断・占いは
            <Link href="/play">診断・占いであそぶ</Link>
            からどうぞ。
          </p>
        </section>
      </div>
    </>
  );
}
