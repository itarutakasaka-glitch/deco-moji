#!/usr/bin/env node
// 補助金データの鮮度を機械監査する CLI。
//  - 締切テキストから実日付を復元し、期限切れ / 締切間近(≤30日) / 期限なし を分類
//  - --http 指定時は各制度URL・区indexURLの HTTP 到達性(200系)も確認
//  - 結果を lib/subsidy/freshness.json に書き出し、--issue で freshness-issue.md も出力
// 使い方:  node scripts/audit-freshness.mjs [--http] [--issue]
//  GitHub Actions の週次cronから叩き、--issue でIssue本文用のMarkdownを出力する。
import fs from "node:fs";
import path from "node:path";
import { auditFreshness, issueMarkdown, ROOT } from "./freshness-core.mjs";

const argv = process.argv.slice(2);
const DO_HTTP = argv.includes("--http");
const EMIT_ISSUE = argv.includes("--issue");

const report = await auditFreshness({ http: DO_HTTP });
fs.writeFileSync(
  path.join(ROOT, "lib", "subsidy", "freshness.json"),
  JSON.stringify(report, null, 2) + "\n",
  "utf8"
);
if (EMIT_ISSUE) {
  fs.writeFileSync(path.join(ROOT, "freshness-issue.md"), issueMarkdown(report), "utf8");
}

const t = report.totals;
console.log(
  `[audit] ${report.auditedAt} subsidies=${t.subsidies} expired=${t.expired} expiring=${t.expiring} undated=${t.undated} deadLinks=${t.deadLinks}`
);
const need = t.expired + t.deadLinks;
console.log(need > 0 ? `ACTION_NEEDED=1 (${need})` : "ACTION_NEEDED=0");
