# LLMO Phase A 設計書 — 区別静的ページ化＋AI可読インフラ v1.0

作成: 2026-07-21（Fable設計・Sonnet実装用）
対象リポ: `deco-moji`（decomoji.xyz）

## 0. これは何か・なぜやるか

ChatGPT/Claude/Perplexity/Google AI Overviews に**引用される**サイトになるための第一弾。
現状、ごみ収集日10,721丁目・補助金203制度という一次データを持っているのに、
**すべてセレクタUIの1ページに閉じ込められていてクローラ/LLMから中身が見えない**。
URLが存在しない情報はAIに引用されない。よって：

1. **区別の静的ページを生成する**（/trash-day/meguro 等 96ページ＋/subsidy/shibuya 等 23ページ）
2. **AI可読インフラ**（llms.txt・robots.txtのAIボット明示・sitemap拡張・JSON-LD）
3. 同時に、**core.tsの97import壁**（後述）から逃れる新データ読み込みパターンを確立する

## 1. 実装前に必ず理解すべき技術的制約【最重要】

### 1-1. core.ts の97import壁（実測済みの再現性バグ）
`lib/gomi/core.ts` のトップレベルimportが**97個になると本番ビルドが必ず壊れる**
（`Could not find the module ... GomiFortune.tsx#default in the React Client Manifest`）。
96個までは正常。データ量は無関係（空JSONでも97個で壊れる）。二分探索で確定済み。

**→ 本フェーズの鉄則: `lib/gomi/core.ts` にimportを1本も追加しない。**
新規ページのデータ読み込みは全て **ビルド時のfs読み込み**（§3-2のローダー）で行う。
各作業後に必ず確認: `grep -c "^import " lib/gomi/core.ts` が **96** のままであること。

### 1-2. devサーバとビルドの排他
devサーバ稼働中に `npm run build` すると `.next` が壊れる。**ビルド前にdev停止**。
壊れた場合は `rm -rf .next` で復旧。

### 1-3. Git運用
- **mainへ直接push禁止**。ブランチ `feat/llmo-ward-pages` を切って作業→PR。
- フェーズごと（A1〜A4）に個別コミット。コミットメッセージ末尾:
  `Co-Authored-By: Claude Sonnet <noreply@anthropic.com>`
- PR本文末尾: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`

### 1-4. 誤情報ゼロ方針
ページの文言で**データに無いことを書かない**。収集時間・祝日運用・年末年始日程は
断定せず「最新・正確な情報は◯◯公式サイトでご確認ください」誘導のみ（既存文言踏襲）。
各区の `omitNote`（扱えない区分の注記）は必ずページに表示する。

### 1-5. デザイン規律
- 情報カードは**縦1列**（グリッド・複数カラム禁止）。表(`<table>`)はこのルールの対象外。
- /trash-day系 = 紫×白（既存 trash-day.css の世界観）。/subsidy系 = 白×ゴールド（sf-系）。
- モバイルで表がはみ出す場合は `overflow-x: auto` のラッパで横スクロール。

### 1-6. データ形状の罠：目黒だけ形が違う
`meguro-schedule.json` だけ `areas: [{ group: string, chome: string[], ...rules }]`（グループ型）。
他の95ファイルは `areas: [{ chome: string, ...rules }]`（丁目単体型）。
ローダー（§3-2）で正規化する。**この分岐を忘れると目黒ページが空になる。**

## 2. スコープ

### やること（Phase A）
- A1: 共有ヘルパー抽出＋レジストリ生成＋fsローダー
- A2: `/trash-day/[muni]` 96ページ＋親ページにリンク索引＋title短縮
- A3: `/subsidy/[ward]` 23ページ＋deadline共通化＋親ページにリンク索引
- A4: llms.txt / robots.ts / sitemap.ts
- A5: 検証一式→PR

### やらないこと（将来フェーズ）
- 丁目別1万URL（Phase B）
- 公開API/公開MCPサーバ（Phase C）
- core.tsの根本リファクタ（クライアントから全データimportを剥がす）
- 名古屋・天白区天白町の追加（97import壁の切り分けで意図的に除外中）
- ごみデータの定期自動更新

---

## 3. Phase A1: 基盤（共有ヘルパー・レジストリ・ローダー）

### 3-1. `lib/gomi/shared.ts`（新規）
core.tsから**純粋関数と型だけ**を抜き出した、JSON importゼロのモジュール。
サーバーページとcore.tsの両方から使う。

```ts
// lib/gomi/shared.ts — JSON importを絶対に置かないこと（97import壁の回避地帯）
export type WeeklyRule = { kind: "weekly"; weekdays: number[] };
export type NthRule = { kind: "nthWeekday"; weekday: number; nths: number[] };
export type Rule = WeeklyRule | NthRule;
export type GomiKey =
  | "burnable" | "recyclable" | "plastic" | "paper" | "nonBurnable" | "mercury";

export const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

// 表示順（core.tsのORDERと同値。core側はUI都合で別管理のため重複定義を許容）
export const CATEGORY_ORDER: GomiKey[] =
  ["burnable", "recyclable", "plastic", "paper", "nonBurnable", "mercury"];

// 既定ラベル（core.tsのTYPES[k].labelと同期。区JSONのcategoriesが優先）
export const CATEGORY_LABELS: Record<GomiKey, string> = {
  burnable: "燃やすごみ",
  recyclable: "びん・缶・ペットボトル",
  plastic: "プラスチック",
  paper: "古紙",
  nonBurnable: "燃やさないごみ",
  mercury: "水銀を含む製品",
};

export function describeRule(rule: Rule | undefined): string {
  if (!rule) return "—";
  if (rule.kind === "weekly")
    return "毎週 " + rule.weekdays.map((w) => WEEK[w]).join("・") + "曜";
  return "第" + rule.nths.join("・") + " " + WEEK[rule.weekday] + "曜";
}
```

**core.ts側の編集（最小限・慎重に）:**
1. 冒頭に `import { WEEK, describeRule } from "./shared";` を追加**しない**。
   代わりに core.ts 内の既存定義を**そのまま残す**（触らない）。
2. core.ts には `export * from "./shared";` も**追加しない**。

→ つまり **core.tsは一切編集しない**（重複定義を許容）。理由: core.tsは97import壁と
シェアURL後方互換を抱えた最重要ファイルで、編集リスク＞重複コスト。
shared.ts冒頭コメントに「core.tsと重複。变更時は両方直す」と明記すること。

### 3-2. `lib/gomi/load-muni.ts`（新規）— ビルド時fsローダー
```ts
// lib/gomi/load-muni.ts — サーバーコンポーネント/ビルド時専用。クライアントから import 禁止。
import fs from "node:fs";
import path from "node:path";
import type { GomiKey, Rule } from "./shared";

export type MuniRow = { chome: string; group?: string; rules: Partial<Record<GomiKey, Rule>> };
export type MuniData = {
  name: string;            // municipality
  source: string;
  sourceUrl?: string;
  license?: string;
  fetchedAt: string;
  categories: Partial<Record<GomiKey, string>>;
  omitNote?: string;
  rows: MuniRow[];
  presentKeys: GomiKey[];  // rowsに1つでも現れるキー（CATEGORY_ORDER順）
};

const RULE_KEYS: GomiKey[] = ["burnable","recyclable","plastic","paper","nonBurnable","mercury"];

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
```

### 3-3. `lib/gomi/registry.ts`（生成物）＋ `scripts/generate-muni-registry.mjs`（新規）
96自治体の slug→ファイル→表示名→都市 の対応表。**JSON importゼロ**（sitemapやリンク索引
から安全にimportできる）。生成スクリプトで作り、生成物をコミットする。

- slug = JSONファイル名から `-schedule.json` を除いたもの（例: `meguro`, `chiba-chuo`,
  `osaka-kita`, `yokohama-tsurumi`, `nagoya-chikusa`）。衝突なし（確認済み）。
  `r` / `og` という既存サブルートとも衝突しない。
- 順序 = core.ts の MUNICIPALITIES 配列と同一（下記リストの順で固定）。
- name はスクリプトが各JSONの `municipality` フィールドから読む（手打ちしない）。

スクリプト仕様（`scripts/generate-muni-registry.mjs`）:
```
const ORDERED_SLUGS = [
  // 東京23区（city: "東京23区"）
  "meguro","shinagawa","taito","koto","bunkyo","chuo","ota","setagaya","nerima",
  "edogawa","suginami","itabashi","shinjuku","shibuya","arakawa","toshima","adachi",
  "katsushika","kita","sumida","minato","nakano","chiyoda",
  // 千葉市（city: "千葉市"）
  "chiba-chuo","chiba-hanamigawa","chiba-inage","chiba-wakaba","chiba-midori","chiba-mihama",
  // 川崎市（city: "川崎市"）
  "kawasaki-kawasaki","kawasaki-saiwai","kawasaki-nakahara","kawasaki-takatsu",
  "kawasaki-miyamae","kawasaki-tama","kawasaki-asao",
  // 大阪市（city: "大阪市"）
  "osaka-miyakojima","osaka-fukushima","osaka-konohana","osaka-nishi","osaka-minato",
  "osaka-taisho","osaka-tennoji","osaka-naniwa","osaka-nishiyodogawa","osaka-higashiyodogawa",
  "osaka-higashinari","osaka-ikuno","osaka-asahi","osaka-joto","osaka-abeno","osaka-sumiyoshi",
  "osaka-higashisumiyoshi","osaka-nishinari","osaka-yodogawa","osaka-tsurumi","osaka-suminoe",
  "osaka-hirano","osaka-kita","osaka-chuo",
  // 横浜市（city: "横浜市"）
  "yokohama-tsurumi","yokohama-kanagawa","yokohama-nishi","yokohama-naka","yokohama-minami",
  "yokohama-hodogaya","yokohama-isogo","yokohama-kanazawa","yokohama-kohoku","yokohama-totsuka",
  "yokohama-konan","yokohama-asahi","yokohama-midori","yokohama-seya","yokohama-sakae",
  "yokohama-izumi","yokohama-aoba","yokohama-tsuzuki",
  // 名古屋市（city: "名古屋市"）※tempaku-tempakuは意図的に除外（97import壁の件）
  "nagoya-chikusa","nagoya-higashi","nagoya-kita","nagoya-nishi","nagoya-nakamura",
  "nagoya-naka","nagoya-showa","nagoya-mizuho","nagoya-atsuta","nagoya-nakagawa",
  "nagoya-minato","nagoya-minami","nagoya-moriyama","nagoya-midori","nagoya-midori-odaka",
  "nagoya-midori-narumi","nagoya-meito","nagoya-tempaku",
];
```
各slugについて `lib/gomi/<slug>-schedule.json` を読み、
`{ slug, file, name(=municipality), city, areaCount(=areas展開後の丁目数) }` を持つ
`export const MUNI_REGISTRY = [...] as const;` を `lib/gomi/registry.ts` に書き出す。
先頭コメントに「生成物。scripts/generate-muni-registry.mjs で再生成」と記す。
**期待値検証をスクリプト内に入れる: エントリ数===96、丁目総数===10721。違ったらthrow。**

### A1完了条件
- `npm run build` が通る（devを止めてから）
- `grep -c "^import " lib/gomi/core.ts` → 96
- `node scripts/generate-muni-registry.mjs` が96件/10721丁目でthrowせず registry.ts を生成

---

## 4. Phase A2: `/trash-day/[muni]` 96ページ

### 4-1. ルーティング
`app/trash-day/[muni]/page.tsx`（新規）。
```ts
export const dynamicParams = false;
export function generateStaticParams() {
  return MUNI_REGISTRY.map((m) => ({ muni: m.slug }));
}
```
既存の `app/trash-day/r/` と `app/trash-day/og/` は静的セグメントが優先されるので共存可。

### 4-2. metadata（generateMetadata）
- title: `${name}のごみ収集日一覧【町丁目別】🗑️何曜日に出す？`
- description: `${name}の町丁目別ごみ収集日（全${rows.length}丁目）。${presentKeysのラベルを「・」区切り}の収集曜日を一覧表で確認できます。出典: ${source}（最終確認日 ${fetchedAt}）。`
- alternates.canonical: `/trash-day/${slug}`
- openGraph / twitter: titleとdescriptionを流用（既存ページの書式に合わせる）

### 4-3. ページ構造（サーバーコンポーネント・JSなしで全情報が見えること）
上から順に:
1. **パンくず**: `ホーム > ごみ収集日カレンダー > ${name}`（Link使用）
2. **h1**: `${name}のごみ収集日（町丁目別一覧）`
3. **リード文**（データ由来の事実のみ）:
   `${name}の全${rows.length}丁目のごみ収集日一覧です。` ＋ 出典
   （`source` テキスト＋ `officialUrl` は registry に無いので **sourceUrl をリンク**、
   sourceUrl が無い区は source テキストのみ）＋ `最終確認日: ${fetchedAt}` ＋
   「収集日は変更される場合があります。必ず公式サイトで最新情報をご確認ください。」
4. **omitNote**があれば注意ボックスで表示（誤情報ゼロ方針の要）
5. **メインの表**: `<div className="gw-tablewrap"><table>` で
   - 列: `丁目` ＋ presentKeys（ヘッダは `categories[k] ?? CATEGORY_LABELS[k]`）
   - 行: rows（目黒は group があれば丁目名の後に小さく group 表示してもよいが必須でない）
   - セル: `describeRule(r.rules[k])`（無ければ "—"）
6. **FAQ（h2: よくある質問）** — 実データから機械生成する3問のみ:
   - Q1 `${name}の${先頭presentKeyのラベル}は何曜日ですか？`
     A: `丁目により異なります。例えば${rows[0].chome}は「${describeRule(rows[0].rules[先頭key])}」です。上の一覧表でお住まいの丁目をご確認ください。`
   - Q2 `このデータの出典はどこですか？`
     A: `${source}を基に作成しています（最終確認日 ${fetchedAt}）。`
   - Q3 `祝日や年末年始の収集はどうなりますか？`
     A: `特別日程になる場合があります。公式サイトで最新の情報をご確認ください。`
7. **ツール導線**: `日付を指定して「次の収集日」を調べる → /trash-day`（Link）
8. **同一都市の他の区へのリンク**（h2: `${city}のほかの区`）: registryの同cityを縦のulで
9. **JSON-LD**（`<script type="application/ld+json">`、`dangerouslySetInnerHTML`）:
   - BreadcrumbList（3階層）
   - FAQPage（§6の3問と**完全に同文**であること — 表示と構造化データの不一致はNG）
   - Dataset: `{ name: "${name} ごみ収集日データ（町丁目別）", description, dateModified: fetchedAt, isBasedOn: sourceUrl, creator: { "@type": "WebSite", name: "デコ文字メーカー", url: "https://www.decomoji.xyz" } }`
     ※licenseはCC BY確定の区だけ `license` フィールドを入れる（licenseフィールドが
     JSONにある場合のみ。無い区は出さない＝誤表記防止）

### 4-4. CSS
`app/trash-day/trash-day.css` に `.gw-` プレフィックスでセクション追加（別ファイルでも可）。
紫×白基調。表: ヘッダ紫背景・白文字、行ゼブラ、`.gw-tablewrap { overflow-x: auto; }`。
モバイルで丁目列が読めること（`white-space: nowrap` は丁目列のみ）。

### 4-5. 親ページ `/trash-day` の改修（2点だけ）
1. **リンク索引の追加**: ページ下部（`gf-about`セクションの後）に
   `h2: 区・市別のごみ収集日一覧ページ` → cityごとに h3 ＋ 縦ul（96本の`<Link>`）。
   これが**クローラの発見経路**なので必須。
2. **titleの短縮**（現状は96区名を全部連結していて長すぎ・有害）:
   - title: `ごみ収集日カレンダー🗑️東京23区・横浜・川崎・千葉・大阪・名古屋対応｜ゴミの日が一目でわかる`
   - description も同様に「東京23区・横浜市・川崎市・千葉市・大阪市・名古屋市の約1万丁目に対応」の形へ書き換え（区名の全列挙をやめる）。
   - OGP/twitterも同時に短縮。本文中の `{WARDS}` 連結箇所は「東京23区・横浜市・川崎市・千葉市・大阪市・名古屋市」の固定文字列に置換。

### A2完了条件
- ビルド後のページ数が +96
- `curl -s http://localhost:3000/trash-day/meguro` の**生HTML**に `上目黒一丁目` と `毎週` が含まれる（JS不要で読める＝LLMO達成の核心）
- `curl -s http://localhost:3000/trash-day/nagoya-chikusa` に `青柳町5丁目` が含まれる
- /trash-day 親ページに96リンクが生HTMLで存在する

---

## 5. Phase A3: `/subsidy/[ward]` 23ページ

### 5-1. deadline共通化（先にやる）
`app/api/subsidy/route.ts` 内の `parseDeadlineIso` / `daysUntil` / `jstToday` を
`lib/subsidy/deadline.ts`（新規）へ移動し、route.ts はそこからimportする（挙動不変）。
ページからも同じ関数を使う。

### 5-2. スラグ表
`lib/subsidy/ward-slugs.ts`（新規）:
```ts
export const WARD_SLUGS: { slug: string; name: string }[] = [
  { slug: "chiyoda", name: "千代田区" }, { slug: "chuo", name: "中央区" },
  { slug: "minato", name: "港区" }, { slug: "shinjuku", name: "新宿区" },
  { slug: "bunkyo", name: "文京区" }, { slug: "taito", name: "台東区" },
  { slug: "sumida", name: "墨田区" }, { slug: "koto", name: "江東区" },
  { slug: "shinagawa", name: "品川区" }, { slug: "meguro", name: "目黒区" },
  { slug: "ota", name: "大田区" }, { slug: "setagaya", name: "世田谷区" },
  { slug: "shibuya", name: "渋谷区" }, { slug: "nakano", name: "中野区" },
  { slug: "suginami", name: "杉並区" }, { slug: "toshima", name: "豊島区" },
  { slug: "kita", name: "北区" }, { slug: "arakawa", name: "荒川区" },
  { slug: "itabashi", name: "板橋区" }, { slug: "nerima", name: "練馬区" },
  { slug: "adachi", name: "足立区" }, { slug: "katsushika", name: "葛飾区" },
  { slug: "edogawa", name: "江戸川区" },
];
```

### 5-3. `app/subsidy/[ward]/page.tsx`（新規）
- データ: `import wards from "@/lib/subsidy/tokyo-wards.json";`（単一importなので壁の対象外）
- `export const revalidate = 86400;`（ISR日次。締切切れが24時間以内に自動で消える）
- `generateStaticParams` = WARD_SLUGS、`dynamicParams = false`
- **表示前フィルタ**: `parseDeadlineIso(s.deadline)` が過去日の制度は**表示しない**
  （APIと同じ誤情報ゼロロジック。`jstToday()` 比較）。除外件数が1以上なら
  「募集期限切れ◯件は自動的に非表示」の一文を出す。
- 構造:
  1. パンくず（ホーム > 補助金・助成金診断 > ${name}）
  2. h1 `${name}の事業者向け補助金・助成金一覧`
  3. リード: 件数・`最終確認日 ${lastChecked}`・区の公式一覧（`indexUrl`）リンク・
     「掲載は参考情報。応募前に必ず公式ページで最新情報をご確認ください」
  4. 制度カード（**縦1列**・sf-系スタイル流用。`import "../subsidy.css";`）:
     制度名 / summary / 上限 maxAmount / 補助率 rate / 締切 deadline / 対象 target /
     公式リンク（`rel="noopener noreferrer"`）
  5. 法務ブロック: 「本サイトは情報提供のみで申請の代行は行いません」＋専門家相談の
     案内（/subsidy 本体の文言をそのまま流用）
  6. 診断ツール導線: `目的で絞って探す → /subsidy`
  7. 他の22区へのリンク（縦ul）
  8. JSON-LD: BreadcrumbList ＋ FAQPage（下記2問・表示文と同文）＋ ItemList（制度名のみ）
     - Q1 `${name}の事業者向け補助金にはどんなものがありますか？`
       A: 現在掲載中の上位3制度名を「、」で列挙＋「など全◯件を掲載しています（最終確認日 ${lastChecked}）。」
     - Q2 `申請の相談はどこにすればよいですか？`
       A: 「区の窓口のほか、東京都よろず支援拠点など無料の公的相談窓口があります。本サイトは情報提供のみで申請代行は行いません。」
- metadata: title `${name}の補助金・助成金一覧【事業者向け・募集中のみ】`、
  description に件数と最終確認日、canonical `/subsidy/${slug}`

### 5-4. 親ページ `/subsidy` の改修
`app/subsidy/page.tsx` のSEOセクション末尾に `h2: 区別の補助金一覧ページ` → 縦ulで23リンク。

### A3完了条件
- ビルド +23ページ
- `curl -s http://localhost:3000/subsidy/shibuya` の生HTMLに「店舗開業支援補助金」が含まれる
- 期限切れ制度（あれば）が表示されないことをコードレビューで確認

---

## 6. Phase A4: AI可読インフラ

### 6-1. `public/llms.txt`（新規）
```
# デコ文字メーカー (decomoji.xyz)

> 日本の生活情報データサイト。東京23区・横浜市・川崎市・千葉市・大阪市・名古屋市の
> 町丁目別ごみ収集日（約10,700丁目）と、東京23区の事業者向け補助金・助成金
> （200制度超・締切切れ自動除外）を、自治体公式サイトを出典として掲載しています。
> 各ページに出典と最終確認日を明記しています。

## ごみ収集日（町丁目別）
- [ごみ収集日カレンダー](https://www.decomoji.xyz/trash-day): 対応全域の検索ツール
- 区別一覧ページ: https://www.decomoji.xyz/trash-day/{slug} 形式（例: /trash-day/meguro）
  対応slugの全リストはサイトマップ https://www.decomoji.xyz/sitemap.xml を参照

## 補助金・助成金（東京23区・事業者向け）
- [補助金・助成金診断](https://www.decomoji.xyz/subsidy): 地域×目的で絞り込む診断ツール
- 区別一覧ページ: https://www.decomoji.xyz/subsidy/{slug} 形式（例: /subsidy/shibuya）
- 国・都道府県分の出典はデジタル庁 jGrants、区独自制度は各区公式サイト

## 引用について
本サイトのデータを引用する場合は decomoji.xyz へのリンクを添えてください。
収集日・募集要件は変わることがあるため、利用者には必ず各自治体の公式ページで
最新情報を確認するよう案内しています。
```
（実装時に文面の数値をregistryの実数に合わせること）

### 6-2. `app/robots.ts` の拡張
既存の全許可は維持しつつ、AIクローラを明示:
```ts
rules: [
  { userAgent: "*", allow: "/" },
  { userAgent: ["GPTBot","OAI-SearchBot","ClaudeBot","Claude-Web","anthropic-ai",
                "PerplexityBot","Google-Extended","CCBot","Applebot-Extended",
                "meta-externalagent"], allow: "/" },
],
```

### 6-3. `app/sitemap.ts` の拡張
- `MUNI_REGISTRY` から `/trash-day/${slug}` ×96（priority 0.8, weekly）
- `WARD_SLUGS` から `/subsidy/${slug}` ×23（priority 0.8, weekly）
（registry.ts / ward-slugs.ts はJSON importゼロなのでsitemapから安全にimport可能）

---

## 7. Phase A5: 検証（受け入れ基準）と提出

### 7-1. 機械検証（全部やる。目視で済ませない）
devを止めてから:
```
rm -rf .next && npm run build      # EXIT 0、ページ数 38 → 157前後
grep -c "^import " lib/gomi/core.ts   # 96 のまま
```
`npm run start`（または改めてdev）で:
1. `curl -s localhost:3000/trash-day/meguro | grep -c "上目黒"` → 1以上
2. `curl -s localhost:3000/trash-day/nagoya-chikusa | grep -c "青柳町5丁目"` → 1以上
3. `curl -s localhost:3000/subsidy/shibuya | grep -c "店舗開業"` → 1以上
4. `curl -s localhost:3000/sitemap.xml | grep -c "trash-day/"` → 97以上
5. `curl -s localhost:3000/robots.txt | grep -c GPTBot` → 1
6. `curl -s localhost:3000/llms.txt` → 200
7. **データ照合スクリプト**（使い捨てでよい）: 各都市1丁目（目黒/上目黒一丁目、
   chiba-chuo/青葉町、kawasaki-kawasaki/浅田、osaka-kita/池田町、
   yokohama-nishi/赤門町2丁目、nagoya-chikusa/青柳町5丁目）について、
   JSONのruleを`describeRule`で文字列化した期待値が、該当ページの生HTMLに
   含まれることをnodeで照合。**全6件一致で合格。**
8. JSON-LD妥当性: ページHTMLから `application/ld+json` を抽出し `JSON.parse` が通る
9. リグレッション: `/trash-day` のインタラクティブUI（区セレクタ96件・丁目選択・
   結果表示）が従来どおり動く。`/subsidy` の診断も同様。
10. dev画面のスクショ（ward1ページ・subsidy1ページ）を撮って確認

### 7-2. 提出
- ブランチ `feat/llmo-ward-pages` にA1〜A4を個別コミット→push→PR作成。
- PR本文: 目的（LLMO Phase A）、ページ数の増分、§7-1の検証結果を貼る。
- **マージはItaruの判断を仰ぐ**（自動マージしない）。
- マージ後、本番で `https://www.decomoji.xyz/trash-day/meguro` と
  `https://www.decomoji.xyz/subsidy/shibuya` の200＋内容を確認して初めて「反映済」と報告
  （ソース更新≠反映。CLAUDE.md「本番反映の定義」に従う）。

## 8. 実装順序まとめ（チェックリスト）

- [ ] A1: shared.ts / load-muni.ts / generate-muni-registry.mjs → registry.ts 生成（96件・10721丁目でthrowなし）→ ビルド緑 → commit
- [ ] A2: /trash-day/[muni] 96ページ＋親ページ索引＋title短縮 → 検証1,2 → commit
- [ ] A3: deadline.ts抽出 → /subsidy/[ward] 23ページ＋親ページ索引 → 検証3 → commit
- [ ] A4: llms.txt / robots.ts / sitemap.ts → 検証4,5,6 → commit
- [ ] A5: §7-1全項目 → PR作成（マージせず報告）

## 9. 既知のリスクと回避

| リスク | 回避 |
|---|---|
| core.tsのimportが97本になる | 新規ページは全てfsローダー経由。core.tsは触らない |
| 目黒のグループ型データでページが空 | loadMuniの配列分岐（§3-2）＋検証7-1-7で目黒を必ず照合 |
| 96ページ分のfs読みでビルドが遅くなる | ビルド時のみの読み込みで実測数十秒増程度の想定。ビルドがタイムアウトする場合はtimeoutを8分に |
| /trash-day/[muni] が r/ og/ と衝突 | 静的セグメント優先で共存（slugにr/ogは無い） |
| FAQ表示文とFAQPage JSON-LDの不一致 | 同じ定数から両方を描画する実装にする |
| 締切表示の鮮度切れ（subsidy） | revalidate=86400のISR＋表示前フィルタ |
```
