"use client";

import { useRef, useState } from "react";

// タップでコピーできる素材タイル。コピーパクられ防止ではなく「選択の手間ゼロ」が目的
export default function CopyTile({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      // アプリ内ブラウザ等で clipboard API が使えない場合のフォールバック
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      ta.remove();
    }
    if (ok) {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <button
      onClick={copy}
      className="w-full text-left rounded-xl px-4 py-3 mb-2 bg-white transition hover:-translate-y-0.5"
      style={{
        border: copied ? "2px solid #4CD964" : "2px solid var(--color-pink-2, #F3C6D4)",
        boxShadow: copied ? "0 4px 14px rgba(76,217,100,.25)" : "0 2px 8px rgba(0,0,0,.04)",
      }}
      title="タップでコピー"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-[1.05rem] break-all">{text}</span>
        <span
          className="text-xs flex-shrink-0 font-bold"
          style={{ color: copied ? "#34A853" : "var(--color-pink-4)" }}
        >
          {copied ? "✓ コピーした！" : "コピー"}
        </span>
      </span>
    </button>
  );
}
