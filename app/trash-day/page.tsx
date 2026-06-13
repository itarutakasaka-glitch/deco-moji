import type { Metadata } from "next";
import Link from "next/link";
import GomiFortune from "@/components/GomiFortune";
import { describeRule, ruleFor, TYPES, ORDER } from "@/lib/gomi/core";
import "./trash-day.css";

export const metadata: Metadata = {
  title: "目黒区 ごみ収集日カレンダー🗑️上目黒四丁目｜ゴミの日が一目でわかる",
  description:
    "目黒区・上目黒四丁目のごみ収集日（燃やすごみ・びん缶ペットボトル・古紙・燃やさないごみ・水銀を含む製品）を曜日と次回予定で一目チェック。調べたあとは「今日のゴミ出し占い」で開運作法も占えます。",
  alternates: { canonical: "/trash-day" },
  openGraph: {
    title: "目黒区 ごみ収集日カレンダー🗑️上目黒四丁目",
    description:
      "上目黒四丁目のゴミの日（燃やすごみ・資源・古紙・燃やさないごみ・水銀製品）を一目でチェック。おまけに今日のゴミ出し占いも。",
    url: "/trash-day",
  },
  twitter: {
    card: "summary_large_image",
    title: "目黒区 ごみ収集日カレンダー🗑️上目黒四丁目",
    description:
      "上目黒四丁目のゴミの日を一目でチェック。おまけに今日のゴミ出し占いも。",
  },
};

export default function TrashDayPage() {
  return (
    <>
      <GomiFortune />
      <div className="gf-root" style={{ minHeight: "auto" }}>
        <section className="gf-about">
          <h2>目黒区・上目黒四丁目のごみ収集日</h2>
          <p>
            このページは、目黒区・上目黒四丁目のごみ収集日（ゴミの日）を
            ひと目で確認できる無料カレンダーです。日付を選ぶと、その日に出せるゴミの種別と、
            燃やすごみ・びん缶ペットボトル・古紙・燃やさないごみ・水銀を含む製品それぞれの
            次の収集予定がわかります。「今日は何ゴミの日？」「次の資源回収はいつ？」を
            朝サッと確認するのにどうぞ。
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
          <h2>おまけ：今日のゴミ出し占い</h2>
          <p>
            収集日を調べたあとは、「今日のゴミ出し占い」で遊べます。占いがその日の
            「正しいゴミの出し方（開運作法）」を、断捨離（手放す作法）×風水（方位・色・アイテム）
            ×ちょいネタの基調で授ける、毎朝の“義務”を楽しくするおみくじです。エンジンは
            <Link href="/shindan">SNSパワー診断</Link>
            と同じ決定論的なシード方式で、同じ日付なら何度開いても同じ結果。名前などの
            個人情報は入力せず、処理はすべてブラウザ内で完結します。結果はXでシェアしたり、
            <Link href="/">デコ文字メーカー</Link>
            でプロフィールを盛る素材にして遊んでください。
          </p>
        </section>
      </div>
    </>
  );
}
