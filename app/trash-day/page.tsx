import type { Metadata } from "next";
import Link from "next/link";
import GomiFortune from "@/components/GomiFortune";
import {
  describeRule,
  ruleFor,
  TYPES,
  ORDER,
  CHOME_LIST,
  DEFAULT_CHOME_INDEX,
} from "@/lib/gomi/core";
import { MUNI_REGISTRY } from "@/lib/gomi/registry";
import "./trash-day.css";
import "./[muni]/muni-page.css";

// 96区名を全部連結すると長大化しSEO/LLMO両面で有害なため、対応都市名のみ短く列挙する
const CITIES = "東京23区・横浜市・川崎市・千葉市・大阪市・名古屋市";
const CITY_ORDER = ["東京23区", "千葉市", "川崎市", "大阪市", "横浜市", "名古屋市"];

export const metadata: Metadata = {
  title: `ごみ収集日カレンダー🗑️${CITIES}対応｜ゴミの日が一目でわかる`,
  description: `${CITIES}の約1万丁目のごみ収集日を、区と丁目を選ぶだけで曜日と次回予定で一目チェック。燃やすごみ・資源・古紙・燃やさないごみなど区ごとの分別区分に対応。調べたあとは「今日のゴミ出し占い」で開運作法も占えます。`,
  alternates: { canonical: "/trash-day" },
  openGraph: {
    title: `ごみ収集日カレンダー🗑️${CITIES}対応`,
    description: `${CITIES}のゴミの日を、区と丁目を選んで一目チェック。おまけに今日のゴミ出し占いも。`,
    url: "/trash-day",
  },
  twitter: {
    card: "summary_large_image",
    title: `ごみ収集日カレンダー🗑️${CITIES}対応`,
    description: `${CITIES}のゴミの日を、区と丁目を選んで一目チェック。おまけに今日のゴミ出し占いも。`,
  },
};

export default function TrashDayPage() {
  return (
    <>
      <GomiFortune />
      <div className="gf-root" style={{ minHeight: "auto" }}>
        <section className="gf-about">
          <h2>ごみ収集日カレンダー（{CITIES} 対応）</h2>
          <p>
            このページは、{CITIES}のごみ収集日（ゴミの日）を
            ひと目で確認できる無料カレンダーです。お住まいの区と丁目を選んで日付を指定すると、
            その日に出せるゴミの種別と、燃やすごみ・資源・古紙・燃やさないごみなど
            区ごとの分別区分に応じた次の収集予定がわかります。「今日は何ゴミの日？」
            「次の資源回収はいつ？」を朝サッと確認するのにどうぞ。現在の対応エリアは
            {CITIES}の全域（合計{CHOME_LIST.length}丁目）で、順次拡大していきます。
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
          <h2>区・市別のごみ収集日一覧ページ</h2>
          {CITY_ORDER.map((city) => {
            const list = MUNI_REGISTRY.filter((m) => m.city === city);
            if (list.length === 0) return null;
            return (
              <div key={city} className="gw-cityIndex">
                <h3>{city}</h3>
                <ul className="gw-linklist">
                  {list.map((m) => (
                    <li key={m.slug}>
                      <Link href={`/trash-day/${m.slug}`}>
                        {m.name}（{m.areaCount}丁目）
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
}
