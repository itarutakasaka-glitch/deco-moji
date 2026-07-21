// lib/gomi/load-muni.ts — サーバーコンポーネント/ビルド時専用。クライアントから import 禁止。
import fs from "node:fs";
import path from "node:path";
import type { GomiKey, Rule } from "./shared";

export type MuniRow = {
  chome: string;
  group?: string;
  rules: Partial<Record<GomiKey, Rule>>;
};
export type MuniData = {
  name: string; // municipality
  source: string;
  sourceUrl?: string;
  license?: string;
  fetchedAt: string;
  categories: Partial<Record<GomiKey, string>>;
  omitNote?: string;
  rows: MuniRow[];
  presentKeys: GomiKey[]; // rowsに1つでも現れるキー（CATEGORY_ORDER順）
};

const RULE_KEYS: GomiKey[] = [
  "burnable",
  "recyclable",
  "plastic",
  "paper",
  "nonBurnable",
  "mercury",
];

export function loadMuni(file: string): MuniData {
  const p = path.join(process.cwd(), "lib", "gomi", file);
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  const rows: MuniRow[] = [];
  for (const a of j.areas ?? []) {
    const rules: MuniRow["rules"] = {};
    for (const k of RULE_KEYS) if (a[k]) rules[k] = a[k];
    if (Array.isArray(a.chome)) {
      // 目黒のグループ型: {group, chome: string[]} → 丁目ごとに行展開（ルール共有）
      for (const c of a.chome) rows.push({ chome: c, group: a.group, rules });
    } else if (typeof a.chome === "string") {
      rows.push({ chome: a.chome, rules });
    }
  }
  const present = new Set<GomiKey>();
  for (const r of rows) for (const k of RULE_KEYS) if (r.rules[k]) present.add(k);
  return {
    name: j.municipality,
    source: j.source,
    sourceUrl: j.sourceUrl,
    license: j.license,
    fetchedAt: j.fetchedAt,
    categories: j.categories ?? {},
    omitNote: j.omitNote,
    rows,
    presentKeys: RULE_KEYS.filter((k) => present.has(k)),
  };
}
