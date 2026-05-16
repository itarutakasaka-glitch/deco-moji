"use client";

import { useState } from "react";
import { frames } from "@/lib/styles";

export default function Frames() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1400);
  };

  return (
    <div className="grid gap-2.5">
      {frames.map((f, idx) => {
        const copied = copiedIndex === idx;
        return (
          <div
            key={idx}
            className="rounded-2xl bg-white px-3.5 py-3 flex items-center gap-3 transition cursor-pointer hover:translate-x-1"
            style={{
              border: "2px solid var(--color-ink)",
              fontFamily: "var(--font-mono-cute)",
            }}
            onClick={() => handleCopy(f, idx)}
          >
            <div
              className="flex-1 text-base overflow-x-auto whitespace-nowrap"
              style={{ color: "var(--color-ink)" }}
            >
              {f}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(f, idx);
              }}
              className="rounded-xl px-3.5 py-2 font-semibold text-sm transition shrink-0"
              style={{
                border: "2px solid var(--color-ink)",
                background: copied
                  ? "var(--color-mint)"
                  : "var(--color-yellow-soft)",
                color: "var(--color-ink)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {copied ? "コピー済✓" : "コピー"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
