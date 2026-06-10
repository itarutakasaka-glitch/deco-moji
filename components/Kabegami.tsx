"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { KB_PRESETS, type KbMember } from "@/lib/kabegami-presets";
import { siteConfig } from "@/lib/site-config";

type Member = KbMember & { on: boolean };
type TplId = "grad" | "stripe" | "checker" | "neon" | "heart";

const TPLS: { id: TplId; label: string }[] = [
  { id: "grad", label: "🌈 メンカラグラデ" },
  { id: "stripe", label: "📐 ななめストライプ" },
  { id: "checker", label: "🏁 チェッカー" },
  { id: "neon", label: "🌙 ネオンネーム" },
  { id: "heart", label: "💕 ハートドット" },
];
const FRAMES: [string, string][] = [
  ["⊹꒰ ", " ꒱⊹"],
  ["⋆˙⟡ ", " ⟡˙⋆"],
  ["✦•┈ ", " ┈•✦"],
  ["♡ ", " ♡"],
  ["", ""],
];
const FRAME_LABELS = ["⊹꒰ ꒱⊹", "⋆˙⟡ ⟡˙⋆", "✦•┈ ┈•✦", "♡ ♡", "なし"];

const W = 1170;
const H = 2532;

function lum(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
}
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 255) + amt));
  const b = Math.min(255, Math.max(0, (n & 255) + amt));
  return `rgb(${r},${g},${b})`;
}

export default function Kabegami() {
  const [members, setMembers] = useState<Member[]>(() =>
    KB_PRESETS.sample.members.map((m) => ({ ...m, on: true }))
  );
  const [presetKey, setPresetKey] = useState("sample");
  const [tpl, setTpl] = useState<TplId>("grad");
  const [showNames, setShowNames] = useState(true);
  const [frameIdx, setFrameIdx] = useState(0);
  const [addName, setAddName] = useState("");
  const [addColor, setAddColor] = useState("#FF5C8A");
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  /* ===== Canvas 描画 ===== */
  const draw = useCallback(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const ms = members.filter((m) => m.on);
    const [f0, f1] = FRAMES[frameIdx];

    ctx.clearRect(0, 0, W, H);
    if (!ms.length) {
      ctx.fillStyle = "#F6E5EC";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#C98FA5";
      ctx.font = "700 64px 'Zen Maru Gothic'";
      ctx.textAlign = "center";
      ctx.fillText("☑️ メンバーを選んでね", W / 2, H / 2);
      return;
    }

    const drawRoundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };
    const drawHeartShape = (x: number, y: number, s: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s / 30, s / 30);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.bezierCurveTo(-1, 2, -8, -6, -15, -1);
      ctx.bezierCurveTo(-22, 5, -12, 16, 0, 26);
      ctx.bezierCurveTo(12, 16, 22, 5, 15, -1);
      ctx.bezierCurveTo(8, -6, 1, 2, 0, 8);
      ctx.fill();
      // 白系メンカラが背景に溶けないよう薄フチ
      ctx.globalAlpha = alpha * 0.5;
      ctx.strokeStyle = "rgba(180,120,140,.45)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    };

    if (tpl === "grad") {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      if (ms.length === 1) {
        g.addColorStop(0, shade(ms[0].color, 40));
        g.addColorStop(1, shade(ms[0].color, -25));
      } else {
        ms.forEach((m, i) => g.addColorStop(i / (ms.length - 1), m.color));
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 130; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.15 + Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(Math.random() * W, Math.random() * H, 1 + Math.random() * 3.5, 0, 7);
        ctx.fill();
      }
    } else if (tpl === "stripe") {
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(-Math.PI / 5);
      const bw = 170;
      const L = Math.hypot(W, H);
      let i = 0;
      for (let x = -L; x < L; x += bw) {
        ctx.fillStyle = ms[i % ms.length].color;
        ctx.fillRect(x, -L, bw, L * 2);
        i++;
      }
      ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,.10)";
      ctx.fillRect(0, 0, W, H);
    } else if (tpl === "checker") {
      const cell = 195;
      let i = 0;
      for (let y = 0; y < H; y += cell)
        for (let x = 0; x < W; x += cell) {
          ctx.fillStyle = ms[(i + ((y / cell) | 0)) % ms.length].color;
          ctx.fillRect(x, y, cell, cell);
          i++;
        }
      ctx.fillStyle = "rgba(255,255,255,.08)";
      ctx.fillRect(0, 0, W, H);
    } else if (tpl === "neon") {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#160b2e");
      g.addColorStop(1, "#0a0618");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 160; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(Math.random() * W, Math.random() * H, 0.8 + Math.random() * 2.4, 0, 7);
        ctx.fill();
      }
      const fs = Math.min(120, 1500 / Math.max(...ms.map((m) => (f0 + m.name + f1).length)));
      const gap = Math.min(210, (H - 700) / ms.length);
      const y0 = H / 2 - (gap * (ms.length - 1)) / 2;
      ctx.textAlign = "center";
      ms.forEach((m, i) => {
        ctx.font = `900 ${fs}px 'Zen Maru Gothic'`;
        const t = f0 + m.name + f1;
        const y = y0 + i * gap;
        if (lum(m.color) < 0.22) {
          // 黒系メンカラは白フチ+白グロウで沈まないように
          ctx.shadowColor = "rgba(255,255,255,.9)";
          ctx.shadowBlur = 34;
          ctx.strokeStyle = "rgba(255,255,255,.85)";
          ctx.lineWidth = fs * 0.05;
          ctx.strokeText(t, W / 2, y);
          ctx.fillStyle = m.color;
          ctx.fillText(t, W / 2, y);
        } else {
          ctx.shadowColor = m.color;
          ctx.shadowBlur = 46;
          ctx.fillStyle = m.color;
          ctx.fillText(t, W / 2, y);
        }
        ctx.shadowBlur = 0;
      });
    } else if (tpl === "heart") {
      ctx.fillStyle = "#FFF7FA";
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 90; i++) {
        const m = ms[i % ms.length];
        drawHeartShape(
          Math.random() * W,
          Math.random() * H,
          14 + Math.random() * 42,
          m.color,
          0.25 + Math.random() * 0.6
        );
      }
    }

    // 名前リスト（ネオンは本文が名前なのでスキップ）
    if (showNames && tpl !== "neon") {
      const color = tpl === "heart" ? "#B85C7A" : "#ffffff";
      ctx.textAlign = "center";
      const fs = Math.min(74, 1320 / Math.max(...ms.map((m) => (f0 + m.name + f1).length), 8));
      const lineH = fs * 1.45;
      const y0 = H - 260 - lineH * (ms.length - 1);
      ctx.fillStyle = "rgba(0,0,0,.18)";
      drawRoundRect(W / 2 - 470, y0 - fs * 1.3, 940, lineH * (ms.length - 1) + fs * 2.1, 40);
      ctx.fill();
      ms.forEach((m, i) => {
        ctx.font = `900 ${fs}px 'Zen Maru Gothic'`;
        ctx.fillStyle = color;
        ctx.shadowColor = "rgba(0,0,0,.35)";
        ctx.shadowBlur = 14;
        ctx.fillText(f0 + m.name + f1, W / 2, y0 + i * lineH);
        ctx.shadowBlur = 0;
      });
    }

    // クレジット（スクショ拡散時のブランド導線）
    ctx.font = "700 34px 'RocknRoll One'";
    ctx.textAlign = "center";
    ctx.fillStyle = tpl === "heart" ? "#C99" : "rgba(255,255,255,.75)";
    ctx.fillText("decomoji.xyz", W / 2, H - 90);
  }, [members, tpl, showNames, frameIdx]);

  useEffect(() => {
    draw();
    // Webフォント読み込み完了後に描き直し（初回はフォールバックフォントで描かれるため）
    let mounted = true;
    document.fonts.ready.then(() => {
      if (mounted) draw();
    });
    return () => {
      mounted = false;
    };
  }, [draw]);

  /* ===== 操作 ===== */
  const loadPreset = (key: string) => {
    setMembers(KB_PRESETS[key].members.map((m) => ({ ...m, on: true })));
    setPresetKey(key);
    showToast(`${KB_PRESETS[key].label} を読み込みました！メンカラは自由に直せるよ`);
  };
  const toggle = (i: number) =>
    setMembers((ms) => ms.map((m, j) => (j === i ? { ...m, on: !m.on } : m)));
  const setColor = (i: number, color: string) =>
    setMembers((ms) => ms.map((m, j) => (j === i ? { ...m, color } : m)));
  const del = (i: number) => setMembers((ms) => ms.filter((_, j) => j !== i));
  const addMember = () => {
    const n = addName.trim();
    if (!n) return;
    setMembers((ms) => [...ms, { name: n, color: addColor, on: true }]);
    setAddName("");
  };
  const selCount = members.filter((m) => m.on).length;

  const download = () => {
    cvRef.current?.toBlob((b) => {
      if (!b) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = "oshi-kabegami.png";
      a.click();
      URL.revokeObjectURL(a.href);
      showToast("壁紙を保存しました！ロック画面に設定してね 💕");
    }, "image/png");
  };
  const copyCaption = () => {
    const names = members.filter((m) => m.on).map((m) => m.name).join("・");
    const text = `推しメンカラ壁紙つくった⊹ ${names} 💕\n#推し活 #メンカラ壁紙 #デコ文字メーカー\n${siteConfig.url}/kabegami`;
    navigator.clipboard.writeText(text).then(() => showToast("キャプションをコピーしました！"));
  };

  return (
    <div className="kb-root">
      <div className="kb-main">
        <div>
          {/* グループプリセット */}
          <section className="kb-panel">
            <h2>
              🎤 グループを選ぶ<span className="kb-hint">（読み込んでから自由に編集OK）</span>
            </h2>
            <div className="kb-chips">
              {Object.entries(KB_PRESETS).map(([key, p]) => (
                <button
                  key={key}
                  className={`kb-chip ${presetKey === key ? "kb-on" : ""}`}
                  onClick={() => loadPreset(key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </section>

          {/* メンバー */}
          <section className="kb-panel">
            <h2>
              ☑️ メンバーを選ぶ<span className="kb-hint">（チェックした子だけ壁紙に入るよ・丸をタップでメンカラ変更）</span>
            </h2>
            <div className="kb-selinfo">
              <span>
                {selCount}人を選択中（全{members.length}人）
              </span>
              <span>
                <button onClick={() => setMembers((ms) => ms.map((m) => ({ ...m, on: true })))}>
                  全員えらぶ
                </button>{" "}
                /{" "}
                <button onClick={() => setMembers((ms) => ms.map((m) => ({ ...m, on: false })))}>
                  全部はずす
                </button>
              </span>
            </div>
            <div>
              {members.map((m, i) => (
                <div
                  key={`${m.name}-${i}`}
                  className={`kb-mrow ${m.on ? "" : "kb-off"}`}
                  onClick={() => toggle(i)}
                >
                  <input
                    type="checkbox"
                    checked={m.on}
                    onChange={() => toggle(i)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="color"
                    className="kb-swatch"
                    value={m.color.length === 7 ? m.color : "#FF5C8A"}
                    onChange={(e) => setColor(i, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    title="メンカラを変更"
                  />
                  <span className="kb-mname">{m.name}</span>
                  <button
                    className="kb-del"
                    title="削除"
                    onClick={(e) => {
                      e.stopPropagation();
                      del(i);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="kb-addrow">
              <input
                type="text"
                maxLength={12}
                placeholder="メンバー名を追加"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMember()}
              />
              <input
                type="color"
                className="kb-addcolor"
                value={addColor}
                onChange={(e) => setAddColor(e.target.value)}
                title="メンバーカラー"
              />
              <button className="kb-addbtn" onClick={addMember}>
                ＋追加
              </button>
            </div>
          </section>

          {/* テンプレ */}
          <section className="kb-panel">
            <h2>🎨 デザインテンプレ</h2>
            <div className="kb-chips">
              {TPLS.map((t) => (
                <button
                  key={t.id}
                  className={`kb-chip ${tpl === t.id ? "kb-on" : ""}`}
                  onClick={() => setTpl(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="kb-optrow">
              <label>
                <input
                  type="checkbox"
                  checked={showNames}
                  onChange={(e) => setShowNames(e.target.checked)}
                />
                名前を入れる
              </label>
              <span style={{ color: "var(--kb-faint)" }}>|</span>
              <span>フレーム:</span>
              <select
                className="kb-frame-sel"
                value={frameIdx}
                onChange={(e) => setFrameIdx(+e.target.value)}
              >
                {FRAME_LABELS.map((l, i) => (
                  <option key={i} value={i}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </section>
        </div>

        {/* プレビュー */}
        <div className="kb-preview">
          <div className="kb-phone">
            <div className="kb-notch" />
            <canvas ref={cvRef} className="kb-cv" width={W} height={H} />
          </div>
          <button className="kb-dlbtn" onClick={download}>
            💾 壁紙を保存（PNG）
          </button>
          <button className="kb-capbtn" onClick={copyCaption}>
            📋 シェア用キャプションをコピー
          </button>
          <p className="kb-note">画像は端末内で生成・保存されます（サーバー送信なし）</p>
        </div>
      </div>

      <div className={`kb-toast ${toast ? "kb-show" : ""}`}>{toast}</div>
    </div>
  );
}
