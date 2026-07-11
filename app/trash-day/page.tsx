import type { Metadata } from "next";
import Link from "next/link";
import GomiFortune from "@/components/GomiFortune";
import {
  describeRule,
  ruleFor,
  TYPES,
  ORDER,
  CHOME_LIST,
  MUNI_OPTIONS,
  DEFAULT_CHOME_INDEX,
} from "@/lib/gomi/core";
import "./trash-day.css";

const WARDS = MUNI_OPTIONS.map((m) => m.name).join("・");

export const metadata: Metadata = {
  title: `東京 ごみ収集日カレンダー🗑️${WARDS}｜ゴミの日が一目でわかる`,
  description:
    `東京の各区（${WARDS}）のごみ収集日を、区と丁目を選ぶだけで曜日と次回予定で一目チェック。燃やすごみ・資源・古紙・燃やさないごみなど区ごとの分別区分に対応。調べたあとは「今日のゴミ出し占い」で開運作法も占えます。`,
  alternates: { canonical: "/trash-day" },
  openGraph: {
    title: `東京 ごみ収集日カレンダー🗑️${WARDS}`,
    description:
      `東京の各区（${WARDS}）のゴミの日を、区と丁目を選んで一目チェック。おまけに今日のゴミ出し占いも。`,
    url: "/trash-day",
  },
  twitter: {
    card: "summary_large_image",
    title: `東京 ごみ収集日カレンダー🗑️${WARDS}`,
    description:
      `東京の各区（${WARDS}）のゴミの日を、区と丁目を選んで一目チェック。おまけに今日のゴミ出し占いも。`,
  },
};

export default function TrashDayPage() {
  return (
    <>
      <GomiFortune />
      <div className="gf-root" style={{ minHeight: "auto" }}>
        <section className="gf-about">
          <h2>東京のごみ収集日（{WARDS} 対応）</h2>
          <p>
            このページは、東京の各区（{WARDS}）のごみ収集日（ゴミの日）を
            ひと目で確認できる無料カレンダーです。お住まいの区と丁目を選んで日付を指定すると、
            その日に出せるゴミの種別と、燃やすごみ・資源・古紙・燃やさないごみなど
            区ごとの分別区分に応じた次の収集予定がわかります。「今日は何ゴミの日？」
            「次の資源回収はいつ？」を朝サッと確認するのにどうぞ。現在の対応エリアは
            {WARDS}の全域（合計{CHOME_LIST.length}丁目）で、順次拡大していきます。
          </p>
          <h2>ごみ収集スケジュールの例（目黒区 上目黒四丁目）</h2>
          <ul className="gf-about-list">
            {ORDER.map((k) => (
              <li key={k}>
                {TYPES[k].em} {TYPES[k].label}：
                {describeRule(ruleFor(DEFAULT_CHOME_INDEX, k))}
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
