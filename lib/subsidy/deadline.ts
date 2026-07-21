// lib/subsidy/deadline.ts — 締切テキストの解析・鮮度判定。
// app/api/subsidy/route.ts と app/subsidy/[ward]/page.tsx の両方から使う共通ロジック。

// 締切テキスト → ISO日付（YYYY-MM-DD）。実日付が無い表現(通年/予算上限まで/null)は null。
export function parseDeadlineIso(text?: string | null): string | null {
  if (!text) return null;
  // "〜2027/2/26" / "2027/2/26" / "2026-12-28"
  const m =
    /(\d{4})[/-](\d{1,2})[/-](\d{1,2})/.exec(text) ||
    /(\d{4})年(\d{1,2})月(\d{1,2})日/.exec(text);
  if (!m) return null;
  const y = +m[1],
    mo = +m[2],
    d = +m[3];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// iso(締切) が today から何日後か（負なら過去）。どちらも JST の暦日で比較。
export function daysUntil(iso: string, today: string): number {
  const a = Date.parse(iso + "T00:00:00Z");
  const b = Date.parse(today + "T00:00:00Z");
  return Math.round((a - b) / 86400000);
}

export function jstToday(): string {
  const j = new Date(Date.now() + 9 * 3600 * 1000);
  return `${j.getUTCFullYear()}-${String(j.getUTCMonth() + 1).padStart(2, "0")}-${String(
    j.getUTCDate()
  ).padStart(2, "0")}`;
}
