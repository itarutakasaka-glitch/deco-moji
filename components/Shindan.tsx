"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  diagnose,
  encodeSlug,
  RARITY_META,
  SCAN_MSGS,
  SNS_LABEL,
  STATS,
  type ShindanResult,
  type Sns,
} from "@/lib/shindan-core";
import { siteConfig } from "@/lib/site-config";

type Phase = "title" | "scan" | "result";

type Star = { left: number; top: number; size: number; dur: number; delay: number };
type Confetto = { id: number; left: number; w: number; h: number; color: string; dur: number; delay: number; round: boolean };

const CF_COLORS = ["#FF2E97", "#FFD700", "#00E5FF", "#9D4EDD", "#FF8A5C", "#fff"];
const SNS_CHIP: { key: Sns; label: string }[] = [
  { key: "x", label: "𝕏" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
];

export default function Shindan() {
  const [phase, setPhase] = useState<Phase>("title");
  const [name, setName] = useState("");
  const [sns, setSns] = useState<Sns>("x");
  const [result, setResult] = useState<ShindanResult | null>(null);
  const [inputErr, setInputErr] = useState(0);

  // 背景の星はマウント後に生成（SSRハイドレーション不一致を避ける）
  const [stars, setStars] = useState<Star[]>([]);
  useEffect(() => {
    setStars(
      Array.from({ length: 90 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2.2,
        dur: 2 + Math.random() * 4,
        delay: -Math.random() * 4,
      }))
    );
  }, []);

  /* ===== スキャン ===== */
  const [scanPct, setScanPct] = useState(0);
  const [scanMsgIdx, setScanMsgIdx] = useState(0);
  const [flashKey, setFlashKey] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (phase !== "scan") return;
    const t0 = performance.now();
    const DUR = 3200;
    let raf = 0;
    const msgTimer = setInterval(
      () => setScanMsgIdx((m) => (m + 1) % SCAN_MSGS.length),
      520
    );
    const tick = () => {
      const p = Math.min(1, (performance.now() - t0) / DUR);
      const eased = p < 0.8 ? p * 1.06 : 0.848 + (p - 0.8) * 0.76;
      setScanPct(Math.min(100, Math.round(eased * 100)));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        clearInterval(msgTimer);
        setFlashKey((k) => k + 1);
        setShakeKey((k) => k + 1);
        setTimeout(() => {
          setPhase("result");
          window.scrollTo({ top: 0 });
        }, 240);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(msgTimer);
    };
  }, [phase]);

  /* ===== 結果演出 ===== */
  const [powerShown, setPowerShown] = useState(0);
  const [barsFilled, setBarsFilled] = useState(false);
  const [confetti, setConfetti] = useState<Confetto[]>([]);
  const cfId = useRef(0);

  useEffect(() => {
    if (phase !== "result" || !result) return;
    // 戦闘力カウントアップ
    const t0 = performance.now();
    const DUR = 1400;
    let raf = 0;
    const up = () => {
      const p = Math.min(1, (performance.now() - t0) / DUR);
      const e = 1 - Math.pow(1 - p, 3);
      setPowerShown(Math.round(result.power * e));
      if (p < 1) raf = requestAnimationFrame(up);
    };
    raf = requestAnimationFrame(up);
    // ステータスバー
    setBarsFilled(false);
    const barTimer = setTimeout(() => setBarsFilled(true), 350);
    // 紙吹雪（SSR/UR）
    if (result.rarity === "SSR" || result.rarity === "UR") {
      const n = result.rarity === "UR" ? 160 : 90;
      const batch: Confetto[] = Array.from({ length: n }, (_, i) => {
        const sz = 6 + Math.random() * 8;
        return {
          id: cfId.current++,
          left: Math.random() * 100,
          w: sz,
          h: sz * (Math.random() > 0.5 ? 1 : 0.4),
          color: CF_COLORS[i % CF_COLORS.length],
          dur: 2.2 + Math.random() * 2.4,
          delay: Math.random() * 0.9,
          round: Math.random() > 0.6,
        };
      });
      setConfetti(batch);
      const cfTimer = setTimeout(() => setConfetti([]), 6000);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(barTimer);
        clearTimeout(cfTimer);
      };
    }
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(barTimer);
    };
  }, [phase, result]);

  /* ===== 操作 ===== */
  const start = useCallback(() => {
    const n = name.trim();
    if (!n) {
      setInputErr((k) => k + 1);
      return;
    }
    setResult(diagnose(n, sns));
    setScanPct(0);
    setScanMsgIdx(0);
    setPowerShown(0);
    setPhase("scan");
  }, [name, sns]);

  const retry = () => {
    setName("");
    setResult(null);
    setPhase("title");
  };

  /* ===== シェア ===== */
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  const shareUrl = result
    ? `${siteConfig.url}/shindan/r/${encodeSlug(result.name, result.sns)}`
    : `${siteConfig.url}/shindan`;

  const shareText = result
    ? `【⚡SNSパワー診断】\n${result.name} のSNS戦闘力は ${result.power.toLocaleString()} ！\n称号：${result.title}【${result.rarity}】\n\n#SNSパワー診断 #デコ文字メーカー\n${shareUrl}`
    : "";

  const shareX = () => {
    window.open(
      "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText),
      "_blank"
    );
  };
  const copyText = (text: string, msg: string) => {
    navigator.clipboard.writeText(text).then(() => showToast(msg));
  };

  return (
    <div className={`sd-root ${shakeKey ? "sd-shake" : ""}`} key={`shake-${shakeKey}`}>
      {/* 背景 */}
      <div className="sd-stars" aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={i}
            className="sd-star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="sd-orb sd-orb-p" aria-hidden="true" />
      <div className="sd-orb sd-orb-c" aria-hidden="true" />
      {flashKey > 0 && <div className="sd-flash sd-go-flash" key={`flash-${flashKey}`} />}

      <main className="sd-main">
        {/* ① タイトル */}
        {phase === "title" && (
          <section className="sd-screen">
            <p className="sd-brand">DECOMOJI PRESENTS</p>
            <h1 className="sd-logo">
              <span className="sd-bolt">⚡</span>SNSパワー診断
              <small>— SNS POWER SCOUTER —</small>
            </h1>
            <p className="sd-lead">
              名前を入れるだけで、あなたの<b>SNS戦闘力</b>と<b>称号</b>を測定。
              <br />
              レアリティ <b>N / R / SR / SSR / UR</b> — キミは何が出る？
            </p>
            <div className="sd-panel">
              <label className="sd-fld" htmlFor="sd-name">
                ▼ 名前 または ハンドルネーム
              </label>
              <input
                id="sd-name"
                className={`sd-input ${inputErr ? "sd-err" : ""}`}
                key={`err-${inputErr}`}
                type="text"
                maxLength={20}
                placeholder="例：みるくてぃ🍓"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && start()}
              />
              <div className="sd-chips">
                {SNS_CHIP.map((c) => (
                  <div
                    key={c.key}
                    className={`sd-chip ${sns === c.key ? "sd-on" : ""}`}
                    onClick={() => setSns(c.key)}
                  >
                    {c.label}
                  </div>
                ))}
              </div>
              <button className="sd-go" onClick={start}>
                ⚡ 戦闘力を測定する
              </button>
              <p className="sd-note">
                ※ 入力した名前はサーバーに送信されません（ブラウザ内で完結）
              </p>
            </div>
          </section>
        )}

        {/* ② スキャン */}
        {phase === "scan" && result && (
          <section className="sd-screen sd-scanwrap">
            <p className="sd-scanname">{result.name} さんを解析中</p>
            <div className="sd-scanner">
              <div className="sd-ring sd-r1" />
              <div className="sd-ring sd-r2" />
              <div className="sd-ring sd-r3" />
              <div className="sd-core">{scanPct}%</div>
            </div>
            <p className="sd-scanstat">{SCAN_MSGS[scanMsgIdx]}</p>
            <div className="sd-barwrap">
              <div className="sd-bar" style={{ width: `${scanPct}%` }} />
            </div>
          </section>
        )}

        {/* ③ 結果 */}
        {phase === "result" && result && (
          <section className="sd-screen">
            <div className={`sd-shout sd-shout-${result.rarity}`}>
              {result.hidden ? "？？？" : result.rarity}
              <span className="sd-sub">{RARITY_META[result.rarity].sub}</span>
            </div>
            <div className="sd-cardwrap">
              <div className="sd-card" data-r={result.rarity}>
                <div className="sd-holo" />
                <div className="sd-cardinner">
                  <div className="sd-sheen" />
                  <div className="sd-cardhead">
                    <span className="sd-rbadge">{result.rarity}</span>
                    <span className="sd-cardlabel">SNS POWER CARD</span>
                  </div>
                  <p className="sd-user">
                    @ {result.name}（{SNS_LABEL[result.sns]}）
                  </p>
                  <p className="sd-title">{result.title}</p>
                  <p className="sd-plabel">— SNS戦闘力 —</p>
                  <p className="sd-power">{powerShown.toLocaleString()}</p>
                  <div className="sd-statrows">
                    {result.stats.map((v, i) => (
                      <div className="sd-statrow" key={STATS[i]}>
                        <span className="sd-nm">{STATS[i]}</span>
                        <div className="sd-barw">
                          <div
                            className="sd-sbar"
                            style={{
                              width: barsFilled ? `${v}%` : "0%",
                              transitionDelay: `${i * 120}ms`,
                            }}
                          />
                        </div>
                        <span className="sd-vl">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="sd-comment">{result.comment}</div>
                  <div className="sd-cardfoot">
                    <span className="sd-url">decomoji.xyz</span>
                    <span className="sd-tag">#SNSパワー診断</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="sd-sharebox">
              <button className="sd-sbtn sd-sx" onClick={shareX}>
                𝕏 で結果をシェア
              </button>
              <button
                className="sd-sbtn sd-stitle"
                onClick={() =>
                  copyText(result.title, "称号をコピー！プロフィールに貼ってね ⊹")
                }
              >
                ⊹ 称号をコピーしてプロフに貼る ⊹
              </button>
              <button
                className="sd-sbtn sd-scopy"
                onClick={() =>
                  copyText(
                    shareText,
                    "キャプションをコピーしました！スクショと一緒に投稿してね"
                  )
                }
              >
                📋 キャプションをコピー（Insta/TikTok用）
              </button>
              <button className="sd-retry" onClick={retry}>
                ↻ もう一回診断する
              </button>
              <p className="sd-backlink">
                <Link href="/">⊹ デコ文字メーカーで称号をもっと盛る ⊹</Link>
              </p>
            </div>
          </section>
        )}
      </main>

      {/* 紙吹雪 */}
      {confetti.map((c) => (
        <span
          key={c.id}
          className="sd-cf"
          style={{
            left: `${c.left}vw`,
            width: c.w,
            height: c.h,
            background: c.color,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
            borderRadius: c.round ? "50%" : 2,
          }}
        />
      ))}

      <div className={`sd-toast ${toast ? "sd-show" : ""}`}>{toast}</div>
    </div>
  );
}
