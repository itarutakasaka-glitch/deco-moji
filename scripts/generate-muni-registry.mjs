#!/usr/bin/env node
// lib/gomi/registry.ts を生成する。96自治体の slug→ファイル→表示名→都市 の対応表。
// 実行: node scripts/generate-muni-registry.mjs
// 期待値: エントリ数=96、丁目総数=10677（違えばthrowしてビルドを止める）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const GOMI_DIR = path.join(ROOT, "lib", "gomi");
const OUT_PATH = path.join(GOMI_DIR, "registry.ts");

const EXPECTED_COUNT = 96;
// 実丁目数（展開後）。目黒だけグループ型データ(例:「青葉台一〜三丁目」=1グループ3丁目)のため、
// 単純な areas.length 集計（過去の非公式カウント）より44件多い。これが正しい実丁目数。
const EXPECTED_AREAS = 10721;

// core.ts の MUNICIPALITIES 配列と同一順（末尾追加のみ＝slug後方互換の原則を踏襲）
const ORDERED_SLUGS = [
  // 東京23区
  "meguro", "shinagawa", "taito", "koto", "bunkyo", "chuo", "ota", "setagaya", "nerima",
  "edogawa", "suginami", "itabashi", "shinjuku", "shibuya", "arakawa", "toshima", "adachi",
  "katsushika", "kita", "sumida", "minato", "nakano", "chiyoda",
  // 千葉市
  "chiba-chuo", "chiba-hanamigawa", "chiba-inage", "chiba-wakaba", "chiba-midori", "chiba-mihama",
  // 川崎市
  "kawasaki-kawasaki", "kawasaki-saiwai", "kawasaki-nakahara", "kawasaki-takatsu",
  "kawasaki-miyamae", "kawasaki-tama", "kawasaki-asao",
  // 大阪市
  "osaka-miyakojima", "osaka-fukushima", "osaka-konohana", "osaka-nishi", "osaka-minato",
  "osaka-taisho", "osaka-tennoji", "osaka-naniwa", "osaka-nishiyodogawa", "osaka-higashiyodogawa",
  "osaka-higashinari", "osaka-ikuno", "osaka-asahi", "osaka-joto", "osaka-abeno", "osaka-sumiyoshi",
  "osaka-higashisumiyoshi", "osaka-nishinari", "osaka-yodogawa", "osaka-tsurumi", "osaka-suminoe",
  "osaka-hirano", "osaka-kita", "osaka-chuo",
  // 横浜市
  "yokohama-tsurumi", "yokohama-kanagawa", "yokohama-nishi", "yokohama-naka", "yokohama-minami",
  "yokohama-hodogaya", "yokohama-isogo", "yokohama-kanazawa", "yokohama-kohoku", "yokohama-totsuka",
  "yokohama-konan", "yokohama-asahi", "yokohama-midori", "yokohama-seya", "yokohama-sakae",
  "yokohama-izumi", "yokohama-aoba", "yokohama-tsuzuki",
  // 名古屋市（tempaku-tempakuは97import壁の切り分けで意図的に除外）
  "nagoya-chikusa", "nagoya-higashi", "nagoya-kita", "nagoya-nishi", "nagoya-nakamura",
  "nagoya-naka", "nagoya-showa", "nagoya-mizuho", "nagoya-atsuta", "nagoya-nakagawa",
  "nagoya-minato", "nagoya-minami", "nagoya-moriyama", "nagoya-midori", "nagoya-midori-odaka",
  "nagoya-midori-narumi", "nagoya-meito", "nagoya-tempaku",
];

const CITY_RANGES = [
  { end: "chiyoda", city: "東京23区" },
  { end: "chiba-mihama", city: "千葉市" },
  { end: "kawasaki-asao", city: "川崎市" },
  { end: "osaka-chuo", city: "大阪市" },
  { end: "yokohama-tsuzuki", city: "横浜市" },
  { end: "nagoya-tempaku", city: "名古屋市" },
];
function cityOf(slug, idx, slugList) {
  for (const r of CITY_RANGES) {
    const endIdx = slugList.indexOf(r.end);
    if (idx <= endIdx) return r.city;
  }
  return "不明";
}

function countAreas(json) {
  let n = 0;
  for (const a of json.areas ?? []) {
    if (Array.isArray(a.chome)) n += a.chome.length;
    else if (typeof a.chome === "string") n += 1;
  }
  return n;
}

const entries = [];
let totalAreas = 0;
for (let i = 0; i < ORDERED_SLUGS.length; i++) {
  const slug = ORDERED_SLUGS[i];
  const file = `${slug}-schedule.json`;
  const p = path.join(GOMI_DIR, file);
  if (!fs.existsSync(p)) {
    throw new Error(`registry生成失敗: ${file} が存在しません（slug=${slug}）`);
  }
  const json = JSON.parse(fs.readFileSync(p, "utf8"));
  const areaCount = countAreas(json);
  totalAreas += areaCount;
  entries.push({
    slug,
    file,
    name: json.municipality,
    city: cityOf(slug, i, ORDERED_SLUGS),
    areaCount,
  });
}

if (entries.length !== EXPECTED_COUNT) {
  throw new Error(
    `registry生成失敗: エントリ数が${entries.length}件（期待値${EXPECTED_COUNT}件）。ORDERED_SLUGSを確認してください。`
  );
}
if (totalAreas !== EXPECTED_AREAS) {
  throw new Error(
    `registry生成失敗: 丁目総数が${totalAreas}（期待値${EXPECTED_AREAS}）。データ変更があった場合はEXPECTED_AREASを更新してください。`
  );
}

const body = entries
  .map(
    (e) =>
      `  { slug: "${e.slug}", file: "${e.file}", name: "${e.name}", city: "${e.city}", areaCount: ${e.areaCount} },`
  )
  .join("\n");

const out = `// lib/gomi/registry.ts — 生成物。scripts/generate-muni-registry.mjs で再生成すること。
// JSON importゼロ（sitemap.ts / 親ページのリンク索引から安全にimportできる）。
// core.ts の 97import 壁を回避するための静的レジストリ。
export type MuniRegistryEntry = {
  slug: string;
  file: string;
  name: string;
  city: string;
  areaCount: number;
};

export const MUNI_REGISTRY: MuniRegistryEntry[] = [
${body}
];

export const MUNI_REGISTRY_TOTAL_AREAS = ${totalAreas};
`;

fs.writeFileSync(OUT_PATH, out, "utf8");
console.log(`[registry] wrote ${OUT_PATH}`);
console.log(`[registry] entries=${entries.length} totalAreas=${totalAreas}`);
