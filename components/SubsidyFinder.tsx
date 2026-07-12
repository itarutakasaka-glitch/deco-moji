"use client";

import { useState } from "react";
import Link from "next/link";

const PREFS = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県",
  "埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県",
  "岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
  "鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県",
  "佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

const PURPOSES: { key: string; label: string; emoji: string }[] = [
  { key: "equipment", label: "設備投資", emoji: "🏭" },
  { key: "sales", label: "販路開拓・展示会", emoji: "📣" },
  { key: "employ", label: "雇用・人材", emoji: "🧑‍💼" },
  { key: "it", label: "IT・DX化", emoji: "💻" },
  { key: "startup", label: "創業・起業", emoji: "🚀" },
  { key: "rd", label: "研究開発", emoji: "🔬" },
  { key: "restructure", label: "事業再構築・転換", emoji: "🔄" },
  { key: "energy", label: "省エネ・環境", emoji: "🌱" },
];

type Item = {
  id: string;
  title: string;
  institution: string;
  maxLimit: number;
  area: string;
  employees: string;
  start: string;
  end: string;
  url: string;
};

function yen(n: number): string {
  if (!n || n <= 0) return "―";
  if (n >= 1_0000_0000) return `${(n / 1_0000_0000).toFixed(n % 1_0000_0000 ? 1 : 0)}億円`;
  if (n >= 1_0000) return `${Math.round(n / 1_0000).toLocaleString()}万円`;
  return `${n.toLocaleString()}円`;
}

function daysLeft(end: string): number | null {
  if (!end) return null;
  const ms = new Date(end).getTime() - Date.now();
  return Math.ceil(ms / 86400000);
}

function fmtDate(iso: string): string {
  if (!iso) return "―";
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export default function SubsidyFinder() {
  const [pref, setPref] = useState("東京都");
  const [sel, setSel] = useState<string[]>([]);
  const [items, setItems] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function toggle(k: string) {
    setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  }

  async function search() {
    setLoading(true);
    setErr("");
    try {
      const p = new URLSearchParams({ pref, purposes: sel.join(",") });
      const res = await fetch(`/api/subsidy?${p.toString()}`);
      if (!res.ok) throw new Error("取得に失敗しました");
      const json = (await res.json()) as { items: Item[] };
      setItems(json.items);
      if (typeof window !== "undefined") {
        document.getElementById("sf-results")?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sf-root">
      <main className="sf-main">
        <section className="sf-hero">
          <div className="sf-brand">補助金・助成金 診断</div>
          <h1 className="sf-logo">使える補助金、いま募集中のものだけ。</h1>
          <p className="sf-tagline">
            地域と目的を選ぶだけ。<b>公募中</b>の補助金・助成金を締切が近い順に。
          </p>
        </section>

        <section className="sf-panel">
          <div className="sf-secLabel">お住まい・所在の都道府県</div>
          <select
            className="sf-pref"
            value={pref}
            onChange={(e) => setPref(e.target.value)}
            aria-label="都道府県を選択"
          >
            {PREFS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <div className="sf-secLabel sf-tight">やりたいこと（複数選択可）</div>
          <div className="sf-chips">
            {PURPOSES.map((p) => (
              <button
                key={p.key}
                className={`sf-chip${sel.includes(p.key) ? " on" : ""}`}
                onClick={() => toggle(p.key)}
                type="button"
              >
                <span className="sf-chipEm">{p.emoji}</span>
                {p.label}
              </button>
            ))}
          </div>

          <button className="sf-go" onClick={search} disabled={loading}>
            {loading ? "検索中…" : "公募中の補助金を探す →"}
          </button>
          <p className="sf-note0">
            国・都道府県の補助金（出典：デジタル庁 jGrants）から、受付中のものを表示します。
          </p>
        </section>

        <section id="sf-results" className="sf-results">
          {err && <div className="sf-err">{err}</div>}

          {items && (
            <>
              <div className="sf-resHead">
                <b>{pref}</b> で受付中：<b>{items.length}</b> 件
                {sel.length > 0 && (
                  <span className="sf-resTags">
                    {sel.map((k) => PURPOSES.find((p) => p.key === k)?.label).join(" / ")}
                  </span>
                )}
              </div>

              {items.length === 0 ? (
                <div className="sf-empty">
                  条件に合う「受付中」の制度が見つかりませんでした。
                  <br />
                  目的を変える・都道府県を「全国」寄りに広げるとヒットしやすくなります。
                </div>
              ) : (
                <div className="sf-list">
                  {items.map((it) => {
                    const d = daysLeft(it.end);
                    const soon = d !== null && d <= 14;
                    return (
                      <a
                        className="sf-card"
                        key={it.id}
                        href={it.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="sf-cardTop">
                          <span className={`sf-deadline${soon ? " soon" : ""}`}>
                            {d === null
                              ? "締切未定"
                              : d < 0
                                ? "締切終了"
                                : d === 0
                                  ? "本日締切"
                                  : `締切まで${d}日`}
                          </span>
                          <span className="sf-area">{it.area}</span>
                        </div>
                        <div className="sf-title">{it.title}</div>
                        <div className="sf-meta">
                          <span className="sf-metaItem">
                            <span className="sf-metaCap">上限額</span>
                            {yen(it.maxLimit)}
                          </span>
                          <span className="sf-metaItem">
                            <span className="sf-metaCap">締切</span>
                            {fmtDate(it.end)}
                          </span>
                          {it.employees && it.employees !== "従業員数の制約なし" && (
                            <span className="sf-metaItem">
                              <span className="sf-metaCap">対象</span>
                              {it.employees}
                            </span>
                          )}
                        </div>
                        {it.institution && (
                          <div className="sf-inst">{it.institution}</div>
                        )}
                        <div className="sf-cta">公式ページで詳細・申請 →</div>
                      </a>
                    );
                  })}
                </div>
              )}

              <div className="sf-advice">
                <div className="sf-adviceT">申請してみたい制度が見つかったら</div>
                <p>
                  補助金・助成金は<b>要件確認・事業計画・書類作成</b>がカギです。採択率を上げたい・
                  手続きが不安な場合は、税理士・行政書士・中小企業診断士など<b>専門家に相談</b>するのが近道です。
                  （本サイトは情報提供のみで、申請の代行は行いません。）
                </p>
              </div>
            </>
          )}
        </section>

        <p className="sf-disclaimer">
          ※ 掲載情報は国・都道府県の補助金データ（出典：
          <a href="https://www.jgrants-portal.go.jp/" target="_blank" rel="noopener noreferrer">
            デジタル庁 jGrants
          </a>
          ）を基にした<b>参考情報</b>です。市区町村独自の制度は順次追加予定。募集状況・要件・締切は変わることがあるため、
          応募前に必ず各制度の公式ページで最新・正確な情報をご確認ください。「必ず受給できる」ことを保証するものではありません。
        </p>

        <Link className="sf-siteLink" href="/">
          ⊹ デコ文字メーカー・ゴミの日カレンダーへ ⊹
        </Link>
      </main>
    </div>
  );
}
