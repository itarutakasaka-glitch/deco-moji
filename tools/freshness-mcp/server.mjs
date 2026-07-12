#!/usr/bin/env node
// 補助金データ鮮度 MCP サーバ（依存ゼロ・stdio / newline-delimited JSON-RPC 2.0）。
// 予約Claudeエージェント等がこれを呼び、期限切れ/締切間近/リンク切れを把握して
// 再スクレイプの要否を判断するためのツール面。
//   tools:
//     audit_subsidies { http?:boolean }     … 全体監査（期限切れ/間近/期限なし/リンク切れ）
//     list_expiring  { days?:number }        … 指定日数以内に締切が来る制度
//     wards_needing_refresh {}               … 再確認おすすめの区（期限切れ多い順）
import readline from "node:readline";
import { auditFreshness } from "../../scripts/freshness-core.mjs";

const SERVER = { name: "decomoji-subsidy-freshness", version: "1.0.0" };
const PROTOCOL = "2024-11-05";

const TOOLS = [
  {
    name: "audit_subsidies",
    description:
      "東京23区の補助金データ(tokyo-wards.json)の鮮度を監査する。締切テキストから実日付を復元し、期限切れ・締切間近(≤30日)・期限なし・(http時)リンク切れを集計して返す。",
    inputSchema: {
      type: "object",
      properties: {
        http: { type: "boolean", description: "trueで各URLのHTTP到達性(200系)も確認（遅い）。既定false。" },
      },
    },
  },
  {
    name: "list_expiring",
    description: "指定日数以内に締切が来る（または既に過ぎた）補助金の一覧を返す。再スクレイプ対象の特定に使う。",
    inputSchema: {
      type: "object",
      properties: {
        days: { type: "number", description: "今日から何日以内を対象にするか。既定30。負の締切(期限切れ)も含む。" },
      },
    },
  },
  {
    name: "wards_needing_refresh",
    description: "期限切れ・締切間近の制度が多い区を多い順に返す。どの区を優先して再確認すべきかの判断に使う。",
    inputSchema: { type: "object", properties: {} },
  },
];

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}
function ok(id, result) {
  send({ jsonrpc: "2.0", id, result });
}
function err(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}
function textResult(id, obj) {
  ok(id, { content: [{ type: "text", text: JSON.stringify(obj, null, 2) }] });
}

async function callTool(name, args = {}) {
  if (name === "audit_subsidies") {
    const r = await auditFreshness({ http: !!args.http });
    return {
      auditedAt: r.auditedAt,
      totals: r.totals,
      wardsNeedingRefresh: r.wardsNeedingRefresh,
      expired: r.expired,
      expiring: r.expiring,
      deadLinks: r.deadLinks,
    };
  }
  if (name === "list_expiring") {
    const days = typeof args.days === "number" ? args.days : 30;
    const r = await auditFreshness({ http: false });
    const items = [...r.expired, ...r.expiring]
      .filter((x) => (x.daysLeft ?? 99999) <= days)
      .sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0));
    return { auditedAt: r.auditedAt, days, count: items.length, items };
  }
  if (name === "wards_needing_refresh") {
    const r = await auditFreshness({ http: false });
    return { auditedAt: r.auditedAt, wards: r.wardsNeedingRefresh };
  }
  throw new Error("unknown tool: " + name);
}

const rl = readline.createInterface({ input: process.stdin });
rl.on("line", async (line) => {
  const s = line.trim();
  if (!s) return;
  let msg;
  try {
    msg = JSON.parse(s);
  } catch {
    return;
  }
  const { id, method, params } = msg;
  try {
    if (method === "initialize") {
      ok(id, { protocolVersion: PROTOCOL, capabilities: { tools: {} }, serverInfo: SERVER });
    } else if (method === "notifications/initialized" || method === "initialized") {
      // notification: no response
    } else if (method === "ping") {
      ok(id, {});
    } else if (method === "tools/list") {
      ok(id, { tools: TOOLS });
    } else if (method === "tools/call") {
      const out = await callTool(params?.name, params?.arguments || {});
      textResult(id, out);
    } else if (id !== undefined) {
      err(id, -32601, "method not found: " + method);
    }
  } catch (e) {
    if (id !== undefined) err(id, -32603, String(e?.message || e));
  }
});
