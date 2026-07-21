// lib/gomi/shared.ts — JSON importを絶対に置かないこと（core.tsの97import壁の回避地帯）
// core.ts と一部定義が重複している。変更する場合は両方直すこと。
export type WeeklyRule = { kind: "weekly"; weekdays: number[] };
export type NthRule = { kind: "nthWeekday"; weekday: number; nths: number[] };
export type Rule = WeeklyRule | NthRule;
export type GomiKey =
  | "burnable"
  | "recyclable"
  | "plastic"
  | "paper"
  | "nonBurnable"
  | "mercury";

export const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

// 表示順（core.tsのORDERと同値）
export const CATEGORY_ORDER: GomiKey[] = [
  "burnable",
  "recyclable",
  "plastic",
  "paper",
  "nonBurnable",
  "mercury",
];

// 既定ラベル（core.tsのTYPES[k].labelと同期。区JSONのcategoriesが優先される）
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
