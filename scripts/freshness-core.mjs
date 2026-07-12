// 補助金データ鮮度監査の純粋ロジック（CLIとMCPサーバで共用）。副作用なし。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..");
export const WARDS_PATH = path.join(ROOT, "lib", "subsidy", "tokyo-wards.json");
export const SOON_DAYS = 30;

export function jstToday() {
  const j = new Date(Date.now() + 9 * 3600 * 1000);
  return `${j.getUTCFullYear()}-${String(j.getUTCMonth() + 1).padStart(2, "0")}-${String(
    j.getUTCDate()
  ).padStart(2, "0")}`;
}
export function parseDeadlineIso(text) {
  if (!text) return null;
  const m =
    /(\d{4})[/-](\d{1,2})[/-](\d{1,2})/.exec(text) ||
    /(\d{4})年(\d{1,2})月(\d{1,2})日/.exec(text);
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
export function daysUntil(iso, today) {
  return Math.round((Date.parse(iso + "T00:00:00Z") - Date.parse(today + "T00:00:00Z")) / 86400000);
}

async function headOk(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: ctrl.signal,
        headers: { "User-Agent": "Mozilla/5.0 (freshness-audit)" },
      });
      clearTimeout(t);
      if (res.status >= 200 && res.status < 400) return true;
      if (method === "GET") return false;
    } catch {
      if (method === "GET") return false;
    }
  }
  return false;
}

// 鮮度監査。{ http:boolean } でURL到達性チェックの有無を指定。report を返す。
export async function auditFreshness({ http = false } = {}) {
  const today = jstToday();
  const wards = JSON.parse(fs.readFileSync(WARDS_PATH, "utf8"));
  const expired = [], expiring = [], undated = [];
  let total = 0;
  const urls = new Set();
  for (const [ward, d] of Object.entries(wards)) {
    if (d.indexUrl) urls.add(d.indexUrl);
    for (const s of d.subsidies) {
      total++;
      if (s.url) urls.add(s.url);
      const iso = parseDeadlineIso(s.deadline);
      const rec = { ward, name: s.name, deadline: s.deadline ?? null, iso, url: s.url };
      if (!iso) undated.push(rec);
      else {
        const dl = daysUntil(iso, today);
        rec.daysLeft = dl;
        if (dl < 0) expired.push(rec);
        else if (dl <= SOON_DAYS) expiring.push(rec);
      }
    }
  }
  expired.sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0));
  expiring.sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0));

  let deadLinks = [];
  if (http) {
    const list = [...urls];
    const CONC = 8;
    for (let i = 0; i < list.length; i += CONC) {
      const batch = list.slice(i, i + CONC);
      const oks = await Promise.all(batch.map((u) => headOk(u)));
      batch.forEach((u, j) => { if (!oks[j]) deadLinks.push(u); });
    }
  }

  const perWard = {};
  for (const r of [...expired, ...expiring])
    perWard[r.ward] = perWard[r.ward] || { ward: r.ward, expired: 0, expiring: 0 };
  for (const r of expired) perWard[r.ward].expired++;
  for (const r of expiring) perWard[r.ward].expiring++;
  const wardsNeedingRefresh = Object.values(perWard).sort(
    (a, b) => b.expired - a.expired || b.expiring - a.expiring
  );

  return {
    auditedAt: today,
    totals: {
      subsidies: total,
      wards: Object.keys(wards).length,
      expired: expired.length,
      expiring: expiring.length,
      undated: undated.length,
      deadLinks: deadLinks.length,
      httpChecked: http,
    },
    wardsNeedingRefresh,
    expired,
    expiring,
    undated,
    deadLinks,
  };
}

export function issueMarkdown(report) {
  const { auditedAt: today, totals: t, expired, expiring, deadLinks, wardsNeedingRefresh } = report;
  const lines = [];
  lines.push(`## 補助金データ 鮮度監査（${today} JST）`);
  lines.push("");
  lines.push(
    `- 制度数 **${t.subsidies}** / 区 ${t.wards} ｜ 期限切れ **${t.expired}** ・締切間近(≤${SOON_DAYS}日) **${t.expiring}** ・期限なし ${t.undated}` +
      (t.httpChecked ? ` ・リンク切れ **${t.deadLinks}**` : "")
  );
  lines.push("");
  if (expired.length) {
    lines.push(`### ⛔ 期限切れ（要・再スクレイプ or 削除）`);
    for (const r of expired.slice(0, 40)) lines.push(`- [${r.ward}] ${r.name}（${r.deadline}）`);
    lines.push("");
  }
  if (expiring.length) {
    lines.push(`### ⏳ 締切間近（≤${SOON_DAYS}日）`);
    for (const r of expiring.slice(0, 40)) lines.push(`- [${r.ward}] ${r.name}（残${r.daysLeft}日 / ${r.deadline}）`);
    lines.push("");
  }
  if (deadLinks.length) {
    lines.push(`### 🔗 到達できないURL`);
    for (const u of deadLinks.slice(0, 40)) lines.push(`- ${u}`);
    lines.push("");
  }
  if (wardsNeedingRefresh.length) {
    lines.push(`### 🔁 再確認おすすめの区`);
    for (const w of wardsNeedingRefresh.slice(0, 10)) lines.push(`- ${w.ward}（切れ${w.expired}・間近${w.expiring}）`);
  }
  return lines.join("\n") + "\n";
}
