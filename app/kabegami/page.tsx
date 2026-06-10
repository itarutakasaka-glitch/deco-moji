import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Kabegami from "@/components/Kabegami";
import "./kabegami.css";

export const metadata: Metadata = {
  title: "推しメンカラ壁紙メーカー⊹メンバーを選んで自分だけのスマホ壁紙",
  description:
    "推しのメンバーカラーでスマホ壁紙を無料作成。Snow Man・SixTONES・なにわ男子・JO1・INI・ME:I・NiziU・TWICEなどのプリセット入り。メンバーをチェックで選ぶだけ、推し単も箱推しもOK。グラデ・ストライプ・ネオンなど5テンプレ。",
  alternates: { canonical: "/kabegami" },
  openGraph: {
    title: "推しメンカラ壁紙メーカー⊹自分だけのメンカラ壁紙",
    description:
      "メンバーをチェックで選ぶだけ。推し単も箱推しも、メンカラのスマホ壁紙が無料で作れる！",
    url: "/kabegami",
  },
  twitter: {
    card: "summary_large_image",
    title: "推しメンカラ壁紙メーカー⊹自分だけのメンカラ壁紙",
    description:
      "メンバーをチェックで選ぶだけ。推し単も箱推しも、メンカラのスマホ壁紙が無料で作れる！",
  },
};

export default function KabegamiPage() {
  return (
    <>
      <SiteHeader
        title="⊹ 推しメンカラ壁紙メーカー ⊹"
        tagline="メンバーをチェックで選ぶだけ。推し単も箱推しも、自分だけのメンカラ壁紙"
      />

      <p
        className="text-center mb-5"
        style={{ fontSize: "0.7rem", color: "#D4A8BB" }}
      >
        ※非公式のファンメイドツールです。各グループ・所属事務所とは関係ありません。
        メンバーカラーは一般に知られる情報をもとにしており、自由に編集できます。
      </p>

      <Kabegami />

      <section
        className="rounded-2xl bg-white px-5 py-5 mb-6 text-[0.92rem] leading-loose"
        style={{ border: "2px solid var(--color-ink)" }}
      >
        <h2 className="font-bold text-base mb-2">推しメンカラ壁紙メーカーとは？</h2>
        <p className="mb-4">
          推しのメンバーカラーを使って、スマホのロック画面・ホーム画面用の壁紙（1170×2532px）を無料で作れるツールです。
          グループを選んでメンバーをチェックするだけ。推し単（1人）なら単色の世界、箱推し（全員）ならメンカラ全色のグラデーションと、
          選び方で仕上がりが変わります。Snow Man・SixTONES・なにわ男子・Travis Japan・King &
          Prince・timelesz・WEST.・JO1・INI・ME:I・NiziU・TWICE・ももクロのプリセットを収録。
          プリセットにないグループや、自分のイメージカラーで作りたいときは、メンバー名とカラーを自由に追加・編集できます。
        </p>
        <h2 className="font-bold text-base mb-2">メンバーカラーについて</h2>
        <p className="mb-4">
          収録しているメンバーカラーは、公式発表やファンの間で広く知られている情報をもとにしています。
          BTSやSEVENTEENなど公式メンバーカラーが存在しないグループは、誤った情報を載せないためプリセットに含めていません。
          カスタム追加機能でお好きな色を設定して作ってください。色の丸をタップすればいつでも変更できます。
        </p>
        <h2 className="font-bold text-base mb-2">あわせて使いたい</h2>
        <p>
          壁紙と一緒にプロフィールも盛るなら<Link href="/" className="underline">デコ文字メーカー</Link>、
          遊べるコンテンツなら<Link href="/shindan" className="underline">SNSパワー診断</Link>もどうぞ。
          作った壁紙は #推し活 #メンカラ壁紙 のハッシュタグでシェアしてね。
        </p>
      </section>

      <SiteFooter />
    </>
  );
}
