"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({
  slot,
  format = "auto",
  responsive = true,
}: {
  slot?: string;
  format?: string;
  responsive?: boolean;
}) {
  const clientId = siteConfig.adsenseClientId;

  useEffect(() => {
    if (!clientId || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 何度もpushすると例外出るが無視してOK
    }
  }, [clientId, slot]);

  // AdSense未設定の場合はプレースホルダー
  if (!clientId || !slot) {
    return (
      <div
        className="text-center px-5 py-7 my-6 text-sm"
        style={{
          background:
            "repeating-linear-gradient(45deg, #f5f5f5, #f5f5f5 10px, #ececec 10px, #ececec 20px)",
          border: "2px dashed #999",
          borderRadius: "12px",
          color: "#888",
          fontFamily: "var(--font-mono-cute)",
        }}
        aria-hidden="true"
      >
        ▼ ad slot (Google AdSense) ▼
      </div>
    );
  }

  return (
    <div className="my-6">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
