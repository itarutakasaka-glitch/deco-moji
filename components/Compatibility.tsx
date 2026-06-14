"use client";

import { useState } from "react";
import Link from "next/link";
import {
  type CompatResult,
  diagnoseCompat,
  encodeSlug,
} from "@/lib/compatibility-core";
import CompatCard from "@/components/CompatCard";

export default function Compatibility() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [err, setErr] = useState(false);
  const [result, setResult] = useState<CompatResult | null>(null);
  const [toast, setToast] = useState("");

  function go() {
    if (!a.trim() || !b.trim()) {
      setErr(true);
      return;
    }
    setErr(false);
    setResult(diagnoseCompat(a, b));
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }
  function back() {
    setResult(null);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }
  function showToast(m: string) {
    setToast(m);
    window.setTimeout(() => setToast(""), 1600);
  }
  function resultUrl(d: CompatResult) {
    const path = `/compatibility/r/${encodeSlug(d.nameA, d.nameB)}`;
    if (typeof window !== "undefined") return window.location.origin + path;
    return "https://www.decomoji.xyz" + path;
  }
  function shareText(d: CompatResult) {
    return `【デコ文字相性診断💞】\n${d.nameA} × ${d.nameB} の相性は… ${d.score}%「${d.tierLabel}」${d.tierEmoji}\n${d.comment}`;
  }
  function shareX(d: CompatResult) {
    const url =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(shareText(d)) +
      "&url=" +
      encodeURIComponent(resultUrl(d)) +
      "&hashtags=デコ文字相性診断,decomoji";
    window.open(url, "_blank", "noopener");
  }
  function copyResult(d: CompatResult) {
    navigator.clipboard
      .writeText(shareText(d) + "\n" + resultUrl(d))
      .then(() => showToast("コピーしました📋"))
      .catch(() => showToast("コピーに失敗しました"));
  }
  function copyDeco(d: CompatResult) {
    navigator.clipboard
      .writeText(d.decoWord)
      .then(() => showToast("デコ文字をコピー📋"))
      .catch(() => showToast("コピーに失敗しました"));
  }

  return (
    <div className="cp-root">
      <main className="cp-main">
        {!result ? (
          <section className="cp-screen">
            <div className="cp-titlebrand">★ decomoji presents ★</div>
            <h1 className="cp-logo">
              💞 デコ文字相性診断 💞
              <span className="cp-logosub">COMPATIBILITY</span>
            </h1>
            <p className="cp-lead">
              ふたりの名前を入れるだけ。<b>相性％</b>と、そのまま貼れる
              <b>デコ文字メッセージ</b>が出る無料診断。
            </p>
            <div className="cp-panel">
              <label className="cp-fld">あなたの名前・ニックネーム</label>
              <input
                className={`cp-input${err && !a.trim() ? " err" : ""}`}
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder="れい"
                maxLength={20}
              />
              <div className="cp-heart">♡</div>
              <label className="cp-fld">お相手の名前・ニックネーム</label>
              <input
                className={`cp-input${err && !b.trim() ? " err" : ""}`}
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder="ゆう"
                maxLength={20}
                onKeyDown={(e) => e.key === "Enter" && go()}
              />
              <button className="cp-go" onClick={go}>
                相性を診断する 💞
              </button>
              <p className="cp-note">
                ※ エンタメ目的の診断です。同じ組み合わせなら何度でも同じ結果（順番は不問）。
                入力はブラウザ内だけで処理され、保存されません。
              </p>
            </div>
          </section>
        ) : (
          <section className="cp-screen">
            <CompatCard result={result} />
            <div className="cp-btns">
              <button className="cp-btn copydeco" onClick={() => copyDeco(result)}>
                ⊹ デコ文字メッセージをコピー ⊹
              </button>
              <button className="cp-btn x" onClick={() => shareX(result)}>
                𝕏 でシェアする
              </button>
              <button className="cp-btn copy" onClick={() => copyResult(result)}>
                結果をコピー 📋
              </button>
              <button className="cp-btn again" onClick={back}>
                ↩ もう一度診断する
              </button>
            </div>
            <Link className="cp-sitelink" href="/play">
              ほかの診断・占いであそぶ →
            </Link>
          </section>
        )}
      </main>
      <div className={`cp-toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
