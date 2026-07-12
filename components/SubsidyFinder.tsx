"use client";

import { useState } from "react";
import Link from "next/link";
import experts from "@/lib/subsidy/experts.json";

type Sponsor = { name: string; org?: string; desc: string; url: string; tel?: string };
type Desk = { name: string; org?: string; desc: string; url: string; free?: boolean };
const SPONSORS = (experts.sponsors ?? []) as Sponsor[];
const DESKS = (experts.desks ?? []) as Desk[];

const PREFS = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県",
  "埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県",
  "岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
  "鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県",
  "佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

const TOKYO_WARDS = [
  "千代田区","中央区","港区","新宿区","文京区","台東区","墨田区","江東区","品川区","目黒区",
  "大田区","世田谷区","渋谷区","中野区","杉並区","豊島区","北区","荒川区","板橋区","練馬区",
  "足立区","葛飾区","江戸川区",
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

type NatItem = {
  source: "national";
  id: string;
  title: string;
  institution: string;
  maxLimit: number;
  area: string;
  employees: string;
  end: string;
  url: string;
};
type WardItem = {
  source: "ward";
  id: string;
  title: string;
  wardName: string;
  summary: string;
  target: string;
  maxText: string;
  rateText: string;
  deadlineText: string;
  lastChecked: string;
  url: string;
};
type ApiResp = {
  pref: string;
  ward: { name: string; lastChecked?: string; indexUrl?: string } | null;
  wardItems: WardItem[];
  items: NatItem[];
};

function yen(n: number): string {
  if (!n || n <= 0) return "―";
  if (n >= 1_0000_0000) return `${(n / 1_0000_0000).toFixed(n % 1_0000_0000 ? 1 : 0)}億円`;
  if (n >= 1_0000) return `${Math.round(n / 1_0000).toLocaleString()}万円`;
  return `${n.toLocaleString()}円`;
}
function daysLeft(end: string): number | null {
  if (!end) return null;
  return Math.ceil((new Date(end).getTime() - Date.now()) / 86400000);
}
function fmtDate(iso: string): string {
  if (!iso) return "―";
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export default function SubsidyFinder() {
  const [pref, setPref] = useState("東京都");
  const [ward, setWard] = useState("");
  const [sel, setSel] = useState<string[]>([]);
  const [data, setData] = useState<ApiResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const isTokyo = pref === "東京都";

  function toggle(k: string) {
    setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  }

  async function search() {
    setLoading(true);
    setErr("");
    try {
      const p = new URLSearchParams({ pref, purposes: sel.join(",") });
      if (isTokyo && ward) p.set("ward", ward);
      const res = await fetch(`/api/subsidy?${p.toString()}`);
      if (!res.ok) throw new Error("取得に失敗しました");
      setData((await res.json()) as ApiResp);
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
            地域と目的を選ぶだけ。<b>国・都道府県＋東京23区</b>の公募中の制度を締切が近い順に。
          </p>
        </section>

        <section className="sf-panel">
          <div className="sf-secLabel">お住まい・所在の都道府県</div>
          <select className="sf-pref" value={pref} onChange={(e) => { setPref(e.target.value); setWard(""); }} aria-label="都道府県を選択">
            {PREFS.map((p) => (<option key={p} value={p}>{p}</option>))}
          </select>

          {isTokyo && (
            <>
              <div className="sf-secLabel sf-tight">
                区（東京23区は区独自の制度も表示）
              </div>
              <select className="sf-pref" value={ward} onChange={(e) => setWard(e.target.value)} aria-label="区を選択">
                <option value="">選択しない（都・国のみ）</option>
                {TOKYO_WARDS.map((w) => (<option key={w} value={w}>{w}</option>))}
              </select>
            </>
          )}

          <div className="sf-secLabel sf-tight">やりたいこと（複数選択可）</div>
          <div className="sf-chips">
            {PURPOSES.map((p) => (
              <button key={p.key} className={`sf-chip${sel.includes(p.key) ? " on" : ""}`} onClick={() => toggle(p.key)} type="button">
                <span className="sf-chipEm">{p.emoji}</span>{p.label}
              </button>
            ))}
          </div>

          <button className="sf-go" onClick={search} disabled={loading}>
            {loading ? "検索中…" : "公募中の補助金を探す →"}
          </button>
          <p className="sf-note0">
            国・都道府県は出典：デジタル庁 jGrants（受付中のみ）。東京23区は各区公式を基に整備。
          </p>
        </section>

        <section id="sf-results" className="sf-results">
          {err && <div className="sf-err">{err}</div>}

          {data && (
            <>
              {/* 区独自の制度 */}
              {data.ward && (
                <div className="sf-block">
                  <div className="sf-resHead">
                    <span className="sf-badgeWard">区の制度</span>
                    <b>{data.ward.name}</b> 独自：<b>{data.wardItems.length}</b> 件
                    {data.ward.lastChecked && (
                      <span className="sf-resTags">最終確認日 {data.ward.lastChecked}</span>
                    )}
                  </div>
                  {data.wardItems.length === 0 ? (
                    <div className="sf-empty">
                      選んだ目的に合う{data.ward.name}独自の制度は見つかりませんでした（目的を変えるか、下の国・都道府県の制度をご覧ください）。
                    </div>
                  ) : (
                    <div className="sf-list">
                      {data.wardItems.map((it) => (
                        <a className="sf-card ward" key={it.id} href={it.url} target="_blank" rel="noopener noreferrer">
                          <div className="sf-cardTop">
                            <span className="sf-area">{it.wardName}</span>
                            {it.deadlineText && <span className="sf-deadline">{it.deadlineText}</span>}
                          </div>
                          <div className="sf-title">{it.title}</div>
                          {it.summary && <div className="sf-sum">{it.summary}</div>}
                          <div className="sf-meta">
                            {it.maxText && (
                              <span className="sf-metaItem"><span className="sf-metaCap">上限</span>{it.maxText}</span>
                            )}
                            {it.rateText && (
                              <span className="sf-metaItem"><span className="sf-metaCap">補助率</span>{it.rateText}</span>
                            )}
                          </div>
                          {it.target && <div className="sf-inst">対象：{it.target}</div>}
                          <div className="sf-cta">区の公式ページで詳細・申請 →</div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 国・都道府県 */}
              <div className="sf-block">
                <div className="sf-resHead">
                  <span className="sf-badgeNat">国・都道府県</span>
                  <b>{pref}</b> で受付中：<b>{data.items.length}</b> 件
                  {sel.length > 0 && (
                    <span className="sf-resTags">
                      {sel.map((k) => PURPOSES.find((p) => p.key === k)?.label).join(" / ")}
                    </span>
                  )}
                </div>
                {data.items.length === 0 ? (
                  <div className="sf-empty">
                    条件に合う「受付中」の制度が見つかりませんでした。目的を変える・地域を広げるとヒットしやすくなります。
                  </div>
                ) : (
                  <div className="sf-list">
                    {data.items.map((it) => {
                      const d = daysLeft(it.end);
                      const soon = d !== null && d <= 14;
                      return (
                        <a className="sf-card" key={it.id} href={it.url} target="_blank" rel="noopener noreferrer">
                          <div className="sf-cardTop">
                            <span className={`sf-deadline${soon ? " soon" : ""}`}>
                              {d === null ? "締切未定" : d < 0 ? "締切終了" : d === 0 ? "本日締切" : `締切まで${d}日`}
                            </span>
                            <span className="sf-area">{it.area}</span>
                          </div>
                          <div className="sf-title">{it.title}</div>
                          <div className="sf-meta">
                            <span className="sf-metaItem"><span className="sf-metaCap">上限額</span>{yen(it.maxLimit)}</span>
                            <span className="sf-metaItem"><span className="sf-metaCap">締切</span>{fmtDate(it.end)}</span>
                            {it.employees && it.employees !== "従業員数の制約なし" && (
                              <span className="sf-metaItem"><span className="sf-metaCap">対象</span>{it.employees}</span>
                            )}
                          </div>
                          {it.institution && <div className="sf-inst">{it.institution}</div>}
                          <div className="sf-cta">公式ページで詳細・申請 →</div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="sf-advice">
                <div className="sf-adviceT">申請してみたい制度が見つかったら</div>
                <p>
                  補助金・助成金は<b>要件確認・事業計画・書類作成</b>がカギです。採択率を上げたい・手続きが不安な場合は、
                  税理士・行政書士・中小企業診断士など<b>専門家に相談</b>するのが近道です。
                  （本サイトは情報提供のみで、申請の代行は行いません。）
                </p>
              </div>

              {/* PR枠（有料の固定掲載。掲載時のみ表示・PR明記） */}
              {SPONSORS.length > 0 && (
                <div className="sf-block">
                  <div className="sf-resHead">
                    <span className="sf-badgeNat">PR</span>
                    申請サポートの専門家
                  </div>
                  <div className="sf-list">
                    {SPONSORS.map((s) => (
                      <a className="sf-card sf-sponsor" key={s.name} href={s.url} target="_blank" rel="noopener noreferrer sponsored">
                        <div className="sf-cardTop">
                          <span className="sf-pr">PR</span>
                          {s.org && <span className="sf-area">{s.org}</span>}
                        </div>
                        <div className="sf-title">{s.name}</div>
                        <div className="sf-sum">{s.desc}</div>
                        {s.tel && <div className="sf-inst">☎ {s.tel}</div>}
                        <div className="sf-cta">相談してみる →</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 無料の公的相談窓口 */}
              {DESKS.length > 0 && (
                <div className="sf-block">
                  <div className="sf-resHead">
                    <span className="sf-badgeNat">無料</span>
                    まずは無料で相談できる公的窓口
                    <span className="sf-resTags">国・都の中小企業支援。何度でも無料で相談できます。</span>
                  </div>
                  <div className="sf-list">
                    {DESKS.map((d) => (
                      <a className="sf-card" key={d.name} href={d.url} target="_blank" rel="noopener noreferrer">
                        <div className="sf-cardTop">
                          <span className="sf-deadline">無料</span>
                          {d.org && <span className="sf-area">{d.org}</span>}
                        </div>
                        <div className="sf-title">{d.name}</div>
                        <div className="sf-sum">{d.desc}</div>
                        <div className="sf-cta">公式サイトで相談方法を見る →</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <p className="sf-disclaimer">
          ※ 掲載情報は、国・都道府県は<a href="https://www.jgrants-portal.go.jp/" target="_blank" rel="noopener noreferrer">デジタル庁 jGrants</a>のデータ、
          東京23区は各区公式サイトを基にした<b>参考情報</b>です。募集状況・要件・締切は変わることがあるため、
          応募前に必ず各制度の公式ページで最新・正確な情報をご確認ください。「必ず受給できる」ことを保証するものではありません。
        </p>

        <Link className="sf-siteLink" href="/">⊹ デコ文字メーカー・ゴミの日カレンダーへ ⊹</Link>
      </main>
    </div>
  );
}
