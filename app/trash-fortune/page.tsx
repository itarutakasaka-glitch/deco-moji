import type { Metadata } from "next";
import Link from "next/link";
import GomiFortune from "@/components/GomiFortune";
import { describeRule, ruleFor, TYPES, ORDER } from "@/lib/gomi/core";
import "./trash-fortune.css";

export const metadata: Metadata = {
  title: "ゴミ出し占い🗑️今日の開運作法｜目黒区・上目黒四丁目のごみ収集日",
  description:
    "目黒区・上目黒四丁目のごみ収集日（燃やすごみ・資源・古紙・燃やさないごみ・水銀製品）が一目でわかる。さらに占いが“今日の正しいゴミの出し方（開運作法）”を授ける、断捨離×風水×ネタの毎朝おみくじ。",
  alternates: { canonical: "/trash-fortune" },
  openGraph: {
    title: "ゴミ出し占い🗑️今日の開運作法｜上目黒四丁目",
    description:
      "ごみ収集日が一目でわかる＋占いが今日の開運作法を授ける。断捨離×風水×ネタの毎朝おみくじ。",
    url: "/trash-fortune",
  },
  twitter: {
    card: "summary_large_image",
    title: "ゴミ出し占い🗑️今日の開運作法｜上目黒四丁目",
    description:
      "ごみ収集日が一目でわかる＋占いが今日の開運作法を授ける。断捨離×風水×ネタ。",
  },
};

export default function TrashFortunePage() {
  return (
    <>
      <GomiFortune />
      <div className="gf-root" style={{ minHeight: "auto" }}>
        <section className="gf-about">
          <h2>ゴミ出し占いとは？</h2>
          <p>
            ゴミ出し占いは、目黒区・上目黒四丁目のごみ収集日を調べられる実用ツールと、
            占いを掛け合わせた無料コンテンツです。まず「ゴミ出しの日程を調べる」で
            燃やすごみ・びん缶ペットボトル・古紙・燃やさないごみ・水銀を含む製品の
            収集曜日と次の収集予定を確認でき、続いて占いがその日の
            「正しいゴミの出し方（開運作法）」を授けます。占いエンジンは
            <Link href="/shindan">SNSパワー診断</Link>
            と同じ決定論的なシード方式で、同じ日付なら何度開いても同じ結果になります。
          </p>
          <h2>上目黒四丁目のごみ収集スケジュール</h2>
          <ul className="gf-about-list">
            {ORDER.map((k) => (
              <li key={k}>
                {TYPES[k].em} {TYPES[k].label}：{describeRule(ruleFor(k))}
              </li>
            ))}
          </ul>
          <p>
            ※ 第5週は燃やさないごみの収集はありません。祝日は原則として通常どおり収集されますが、
            年末年始は特別日程になります。最新・正確な情報は
            <a
              href="https://www.city.meguro.tokyo.jp/seisou/kurashi/gomi/youbiichiran.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              目黒区公式サイト
            </a>
            で必ずご確認ください。
          </p>
          <h2>占いのしくみとプライバシー</h2>
          <p>
            占いの結果は日付・地域・その日のごみ種別から決定論的に計算しているため、
            「おみくじ」に近いエンターテインメントです。名前などの個人情報は入力せず、
            処理はすべてブラウザの中だけで完結します。断捨離（手放す作法）と風水
            （方位・色・アイテム）にネタを少し混ぜた基調で、毎朝の“義務”を楽しく彩ります。
            結果はXでシェアしたり、
            <Link href="/">デコ文字メーカー</Link>
            でプロフィールを盛る素材として使ったりして遊んでください。
          </p>
        </section>
      </div>
    </>
  );
}
