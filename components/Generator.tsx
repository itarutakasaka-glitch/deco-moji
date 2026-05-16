"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fontStyles,
  decorators,
  type StyleCategory,
  transformText,
} from "@/lib/styles";

type Tab = "all" | StyleCategory;

const tabs: { key: Tab; label: string }[] = [
  { key: "all", label: "ぜんぶ" },
  { key: "cute", label: "かわいい" },
  { key: "cool", label: "クール" },
  { key: "frame", label: "枠付き" },
  { key: "small", label: "ちいさめ" },
];

export default function Generator({
  defaultText = "kawaii",
}: {
  defaultText?: string;
}) {
  const [text, setText] = useState(defaultText);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  // 表示する変換結果
  const results = useMemo(() => {
    const fontItems = fontStyles
      .filter((s) => activeTab === "all" || s.category === activeTab)
      .map((s) => ({
        key: `font-${s.key}`,
        name: s.name,
        text: transformText(text, s),
      }));
    const decoItems = decorators
      .filter((d) => activeTab === "all" || d.category === activeTab)
      .map((d) => ({
        key: `deco-${d.key}`,
        name: d.name,
        text: d.wrap(text),
      }));
    return [...fontItems, ...decoItems];
  }, [text, activeTab]);

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopiedKey(key);
    setToastVisible(true);
  };

  useEffect(() => {
    if (!copiedKey) return;
    const t = setTimeout(() => setCopiedKey(null), 1400);
    return () => clearTimeout(t);
  }, [copiedKey]);

  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastVisible(false), 1600);
    return () => clearTimeout(t);
  }, [toastVisible]);

  return (
    <div>
      {/* 入力カード */}
      <div
        className="relative rounded-3xl bg-white p-6 shadow-cute mb-7"
        style={{ border: "3px solid var(--color-ink)" }}
      >
        <div
          className="absolute -top-[18px] right-5 w-9 h-9 rounded-full flex items-center justify-center text-base"
          style={{
            background: "var(--color-yellow-soft)",
            border: "3px solid var(--color-ink)",
            color: "var(--color-pink-4)",
          }}
          aria-hidden="true"
        >
          ✿
        </div>

        <label
          htmlFor="deco-input"
          className="block font-semibold mb-2 text-sm"
          style={{ color: "var(--color-pink-4)" }}
        >
          ▼ 変換したい文字を入れてね
        </label>
        <input
          id="deco-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="例: HelloWorld / kawaii / 推し活"
          maxLength={50}
          className="w-full rounded-2xl px-4 py-3.5 text-base outline-none transition"
          style={{
            border: "2px solid var(--color-pink-2)",
            background: "var(--color-cream)",
            fontFamily: "inherit",
            color: "var(--color-ink)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-pink-4)";
            e.currentTarget.style.boxShadow =
              "0 0 0 4px rgba(232, 91, 160, 0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--color-pink-2)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />

        {/* タブ */}
        <div className="flex gap-1.5 mt-5 flex-wrap">
          {tabs.map((t) => {
            const active = t.key === activeTab;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className="rounded-full px-4 py-2 font-semibold text-sm transition-transform"
                style={{
                  border: "2px solid var(--color-ink)",
                  background: active ? "var(--color-ink)" : "white",
                  color: active ? "white" : "var(--color-ink)",
                  fontFamily: "inherit",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "none";
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 結果一覧 */}
      <div className="grid gap-3">
        {results.map((r) => {
          const copied = copiedKey === r.key;
          return (
            <div
              key={r.key}
              className="rounded-2xl bg-white px-4 py-3.5 flex items-center gap-3 shadow-cute-hover flex-col sm:flex-row sm:items-center"
              style={{ border: "2px solid var(--color-ink)" }}
            >
              <div
                className="text-xs font-semibold uppercase tracking-wider self-start sm:self-auto"
                style={{
                  color: "var(--color-pink-4)",
                  flex: "0 0 110px",
                }}
              >
                {r.name}
              </div>
              <div
                className="flex-1 text-base sm:text-lg break-all w-full"
                style={{
                  color: "var(--color-ink)",
                  minHeight: "1.6em",
                }}
              >
                {r.text}
              </div>
              <button
                onClick={() => handleCopy(r.key, r.text)}
                className="rounded-xl px-3.5 py-2 font-semibold text-sm transition shrink-0 self-end sm:self-auto"
                style={{
                  border: "2px solid var(--color-ink)",
                  background: copied
                    ? "var(--color-mint)"
                    : "var(--color-yellow-soft)",
                  color: "var(--color-ink)",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                {copied ? "コピー済✓" : "コピー"}
              </button>
            </div>
          );
        })}
      </div>

      {/* トースト */}
      <div
        className="fixed left-1/2 z-50 rounded-full px-6 py-3 font-semibold text-sm transition-transform pointer-events-none"
        style={{
          bottom: "28px",
          background: "var(--color-ink)",
          color: "white",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          transform: toastVisible
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(120%)",
        }}
        role="status"
        aria-live="polite"
      >
        コピーしたよ ✦
      </div>
    </div>
  );
}
