"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  type DateParts,
  type Fortune,
  type GomiKey,
  TYPES,
  ORDER,
  CHOME_LIST,
  DEFAULT_CHOME_INDEX,
  chomeLabel,
  describeRule,
  ruleFor,
  typesOn,
  nextSchedule,
  isYearEndPeriod,
  buildFortune,
  partsFromDate,
  partsFromIso,
  isoOf,
  addDays,
  fmtShort,
  encodeSlug,
  SCHEDULE_SOURCE,
} from "@/lib/gomi/core";
import FortuneCard from "@/components/FortuneCard";

const OFFICIAL_URL =
  "https://www.city.meguro.tokyo.jp/seisou/kurashi/gomi/youbiichiran.html";

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) => {
        const z = ((i * 9301 + 49297) % 233280) / 233280;
        const x = ((i * 4099 + 137) % 100);
        const y = ((i * 7919 + 311) % 100);
        return {
          left: `${x}%`,
          top: `${y}%`,
          size: 1 + z * 2.2,
          dur: `${2 + z * 4}s`,
          delay: `${-z * 4}s`,
        };
      }),
    []
  );
  return (
    <div className="gf-stars" aria-hidden>
      {stars.map((s, i) => (
        <span
          key={i}
          className="gf-star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDuration: s.dur,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}

function Badges({ list }: { list: GomiKey[] }) {
  if (!list.length) {
    return (
      <div className="gf-noCollect">
        この日は収集がありません。
        <br />
        “出さない日”もまた、占いの一部。
      </div>
    );
  }
  return (
    <div className="gf-gomiBadges">
      {list.map((k) => {
        const t = TYPES[k];
        return (
          <span className={`gf-gBadge ${t.cls}`} key={k}>
            <span className="gf-em">{t.em}</span>
            {t.label}
          </span>
        );
      })}
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(() => {
    const cols = ["#FFD700", "#FF2E97", "#00E5FF", "#9D4EDD", "#3DDC84"];
    return Array.from({ length: 70 }, (_, i) => {
      const z = ((i * 6151 + 89) % 1000) / 1000;
      const z2 = ((i * 3571 + 401) % 1000) / 1000;
      const sz = 6 + z * 8;
      return {
        left: `${(i * 137) % 100}vw`,
        w: sz,
        h: sz * (z2 > 0.5 ? 1 : 0.4),
        bg: cols[i % cols.length],
        dur: `${2.2 + z * 2.4}s`,
        delay: `${z2 * 0.6}s`,
        radius: z2 > 0.6 ? "50%" : "2px",
      };
    });
  }, []);
  return (
    <div className="gf-confettiWrap" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="gf-confetti"
          style={{
            left: p.left,
            width: p.w,
            height: p.h,
            background: p.bg,
            animationDuration: p.dur,
            animationDelay: p.delay,
            borderRadius: p.radius,
          }}
        />
      ))}
    </div>
  );
}

export default function GomiFortune() {
  const [iso, setIso] = useState<string>("");
  const [chomeIndex, setChomeIndex] = useState<number>(DEFAULT_CHOME_INDEX);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [toast, setToast] = useState<string>("");

  // 初期日付＝今日（クライアントのローカル日付）
  useEffect(() => {
    setIso(isoOf(partsFromDate(new Date())));
  }, []);

  const parts: DateParts | null = iso ? partsFromIso(iso) : null;
  const today = parts ? typesOn(chomeIndex, parts) : [];
  const next = parts ? nextSchedule(chomeIndex, parts) : [];
  const yearEnd = parts ? isYearEndPeriod(parts) : false;

  const todayIso = isoOf(partsFromDate(new Date()));
  const dateLabel = parts
    ? iso === todayIso
      ? "今日"
      : fmtShort(parts)
    : "選んだ日";

  function quick(offset: number) {
    setIso(isoOf(addDays(partsFromDate(new Date()), offset)));
  }
  function openFortune() {
    if (!parts) return;
    setFortune(buildFortune(chomeIndex, parts));
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }
  function back() {
    setFortune(null);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }

  function showToast(m: string) {
    setToast(m);
    window.setTimeout(() => setToast(""), 1600);
  }
  function shareText(f: Fortune) {
    const ts = f.today.length
      ? f.today.map((k) => TYPES[k].em + TYPES[k].label).join("・")
      : "収集なし";
    return `【ゴミ出し占い🗑️】${f.dateLong}\n${f.area}／今日のゴミ：${ts}\n運勢：${f.rank.t}「${f.rank.s}」\n${f.neta}`;
  }
  function resultUrl(f: Fortune) {
    const path = `/trash-day/r/${encodeSlug(f.chomeIndex, f.parts)}`;
    if (typeof window !== "undefined") return window.location.origin + path;
    return "https://www.decomoji.xyz" + path;
  }
  function shareX(f: Fortune) {
    const url =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(shareText(f)) +
      "&url=" +
      encodeURIComponent(resultUrl(f)) +
      "&hashtags=ゴミ出し占い,decomoji";
    window.open(url, "_blank", "noopener");
  }
  function copyResult(f: Fortune) {
    navigator.clipboard
      .writeText(shareText(f) + "\n" + resultUrl(f))
      .then(() => showToast("コピーしました📋"))
      .catch(() => showToast("コピーに失敗しました"));
  }

  return (
    <div className="gf-root">
      <Stars />
      <div className="gf-orb gf-orb-p" aria-hidden />
      <div className="gf-orb gf-orb-c" aria-hidden />

      <main className="gf-main">
        {!fortune ? (
          /* ① 日程を調べる */
          <section className="gf-screen">
            <div className="gf-brand">★ 目黒区 ごみ収集日チェッカー ★</div>
            <h1 className="gf-logo">
              <span className="gf-deco">🗑️</span> ゴミの日カレンダー{" "}
              <span className="gf-deco">♻️</span>
              <br />
              <span className="gf-logoSub">目黒区版</span>
            </h1>
            <p className="gf-tagline">
              いつ・何を出す？が<b>ひと目</b>でわかる。
            </p>
            <div className="gf-areaPillWrap">
              <span className="gf-areaPill">📍 目黒区・{chomeLabel(chomeIndex)}</span>
            </div>

            <div className="gf-panel">
              <div className="gf-secLabel">📍 お住まいの丁目を選ぶ</div>
              <select
                className="gf-chomeSelect"
                value={chomeIndex}
                onChange={(e) => setChomeIndex(Number(e.target.value))}
                aria-label="丁目を選択"
              >
                {CHOME_LIST.map((c, i) => (
                  <option key={i} value={i}>
                    {c.chome}
                  </option>
                ))}
              </select>

              <div className="gf-divider" />

              <div className="gf-secLabel">📅 ごみ収集スケジュール</div>
              <div className="gf-weekTable">
                {ORDER.map((k) => {
                  const t = TYPES[k];
                  return (
                    <div className={`gf-wRow ${t.cls}`} key={k}>
                      <span className="gf-wName">
                        <span className="gf-em">{t.em}</span>
                        {t.label}
                      </span>
                      <span className="gf-wWhen">
                        {describeRule(ruleFor(chomeIndex, k))}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="gf-divider" />

              <div className="gf-dateRow">
                <label htmlFor="gf-date">日付</label>
                <input
                  id="gf-date"
                  type="date"
                  value={iso}
                  onChange={(e) => setIso(e.target.value)}
                />
              </div>
              <div className="gf-quickRow">
                <button className="gf-qbtn" onClick={() => quick(0)}>
                  今日
                </button>
                <button className="gf-qbtn" onClick={() => quick(1)}>
                  明日
                </button>
                <button className="gf-qbtn" onClick={() => quick(2)}>
                  あさって
                </button>
              </div>

              {yearEnd && (
                <div className="gf-warn">
                  ⚠ 年末年始（12/29〜1/3）は特別日程です。下の予定は通常ルールの参考表示です。実際の収集日は
                  <a href={OFFICIAL_URL} target="_blank" rel="noopener noreferrer">
                    目黒区公式
                  </a>
                  で必ずご確認ください。
                </div>
              )}

              <div className="gf-schedBlock">
                <div className="gf-secLabel gf-tight">
                  {dateLabel}に出せるゴミ
                </div>
                <Badges list={today} />
              </div>
              <div className="gf-schedBlock gf-last">
                <div className="gf-secLabel gf-tight">次の収集予定</div>
                <div className="gf-nextList">
                  {next.map(({ key, date, days }) => {
                    const t = TYPES[key];
                    const soon = days !== null && days <= 1;
                    return (
                      <div className="gf-nextRow" key={key}>
                        <span className="gf-nm">
                          <span className="gf-em">{t.em}</span>
                          {t.label}
                        </span>
                        <span className={`gf-dt${soon ? " soon" : ""}`}>
                          {date ? fmtShort(date) : "—"}
                          {days === 0 ? " ・今日" : days === 1 ? " ・明日" : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 調べた結果の下に現れる、占いへの導線 */}
              <button
                className="gf-fortuneCta"
                onClick={openFortune}
                disabled={!parts}
              >
                <span className="gf-fortuneCtaLabel">＼ ちょっと一息 ／</span>
                <span className="gf-fortuneCtaTitle">🔮 今日のゴミ出し占い ✨</span>
                <span className="gf-fortuneCtaSub">
                  占いが「今日の正しいゴミの出し方＝開運作法」を授けます ▶
                </span>
              </button>
            </div>

            <p className="gf-note">
              ※ {SCHEDULE_SOURCE.municipality}公式「資源とごみの収集日」準拠（{SCHEDULE_SOURCE.fetchedAt}
              取得・上目黒四丁目検証済）。最新・正確な情報は
              <a href={OFFICIAL_URL} target="_blank" rel="noopener noreferrer">
                区公式
              </a>
              でご確認ください。占いはエンターテインメントです。
            </p>
          </section>
        ) : (
          /* ② 占い結果 */
          <section className="gf-screen">
            {fortune.rank.conf && <Confetti />}
            <FortuneCard fortune={fortune} />
            <div className="gf-btns">
              <button className="gf-btn x" onClick={() => shareX(fortune)}>
                𝕏 でシェアする
              </button>
              <button className="gf-btn copy" onClick={() => copyResult(fortune)}>
                結果をコピー 📋
              </button>
              <button className="gf-btn again" onClick={back}>
                ↩ 日程にもどる
              </button>
            </div>
            <Link className="gf-siteLink" href="/">
              もっと遊ぶ → <b>デコ文字メーカー</b>
            </Link>
          </section>
        )}
      </main>

      <div className={`gf-toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
