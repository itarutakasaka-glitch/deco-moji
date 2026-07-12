import { NextResponse } from "next/server";

// jGrants（デジタル庁）公開API＝国＋都道府県の補助金。認証不要・CC BY（出典明記で商用可）。
// v0: 目的キーワードで公募中を検索→対象地域で絞り→締切が近い順に返す。
const JG = "https://api.jgrants-portal.go.jp/exp/v1/public/subsidies";

// 目的（UIのチップ）→ jGrantsキーワード
const PURPOSE_KEYWORDS: Record<string, string> = {
  equipment: "設備",
  sales: "販路",
  employ: "雇用",
  it: "IT",
  startup: "創業",
  rd: "研究開発",
  restructure: "事業再構築",
  energy: "省エネ",
};

type JgItem = {
  id: string;
  title: string;
  name: string;
  institution_name: string;
  subsidy_max_limit: number | null;
  target_area_search: string;
  target_number_of_employees: string;
  acceptance_start_datetime: string;
  acceptance_end_datetime: string;
};

async function fetchByKeyword(keyword: string): Promise<JgItem[]> {
  const p = new URLSearchParams({
    keyword,
    sort: "acceptance_end_datetime",
    order: "ASC",
    acceptance: "1", // 受付中のみ＝鮮度
  });
  const res = await fetch(`${JG}?${p.toString()}`, {
    headers: { Accept: "application/json" },
    // 公募は日次で開閉。6時間キャッシュ（鮮度と負荷のバランス）
    next: { revalidate: 60 * 60 * 6 },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { result?: JgItem[] };
  return json.result ?? [];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pref = (searchParams.get("pref") || "").trim(); // 例「東京都」
  const purposes = (searchParams.get("purposes") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // 目的キーワード（未選択なら広めに「補助金」）
  const keywords = purposes.length
    ? purposes.map((p) => PURPOSE_KEYWORDS[p]).filter(Boolean)
    : ["補助金"];

  // 各キーワードで取得→id重複排除
  const byId = new Map<string, JgItem>();
  const settled = await Promise.all(keywords.map((k) => fetchByKeyword(k)));
  for (const list of settled) for (const it of list) byId.set(it.id, it);

  let items = [...byId.values()];

  // 対象地域で絞り込み（全国＋選択した都道府県を残す）
  if (pref) {
    items = items.filter(
      (it) =>
        it.target_area_search === "全国" ||
        (it.target_area_search || "").includes(pref)
    );
  }

  // 締切が近い順（受付中のみなので、締切逆算で緊急度を出す）
  items.sort((a, b) =>
    (a.acceptance_end_datetime || "").localeCompare(b.acceptance_end_datetime || "")
  );

  const result = items.slice(0, 40).map((it) => ({
    id: it.id,
    title: it.title || it.name,
    institution: it.institution_name || "",
    maxLimit: it.subsidy_max_limit || 0,
    area: it.target_area_search || "",
    employees: it.target_number_of_employees || "",
    start: it.acceptance_start_datetime || "",
    end: it.acceptance_end_datetime || "",
    url: `https://www.jgrants-portal.go.jp/subsidy/${it.id}`,
  }));

  return NextResponse.json(
    { count: result.length, items: result },
    { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } }
  );
}
