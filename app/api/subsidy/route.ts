import { NextResponse } from "next/server";
import wards from "@/lib/subsidy/tokyo-wards.json";
import { parseDeadlineIso, daysUntil, jstToday } from "@/lib/subsidy/deadline";

// jGrants（デジタル庁）公開API＝国＋都道府県の補助金。認証不要・CC BY（出典明記で商用可）。
// 加えて、東京23区は市区町村独自の補助金を自前データ(tokyo-wards.json)で上乗せ（jGrantsが取りこぼす層）。
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

type WardSubsidy = {
  name: string;
  field: string[];
  summary?: string;
  target?: string;
  maxAmount?: string | null;
  rate?: string | null;
  deadline?: string | null;
  url: string;
};
type WardData = { indexUrl?: string; lastChecked?: string; subsidies: WardSubsidy[] };
const WARDS = wards as Record<string, WardData>;

async function fetchByKeyword(keyword: string): Promise<JgItem[]> {
  const p = new URLSearchParams({
    keyword,
    sort: "acceptance_end_datetime",
    order: "ASC",
    acceptance: "1",
  });
  const res = await fetch(`${JG}?${p.toString()}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 60 * 6 },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { result?: JgItem[] };
  return json.result ?? [];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pref = (searchParams.get("pref") || "").trim();
  const ward = (searchParams.get("ward") || "").trim();
  const purposes = (searchParams.get("purposes") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const keywords = purposes.length
    ? purposes.map((p) => PURPOSE_KEYWORDS[p]).filter(Boolean)
    : ["補助金"];

  const todayJst = jstToday();

  // 国＋都道府県（jGrants）
  const byId = new Map<string, JgItem>();
  const settled = await Promise.all(keywords.map((k) => fetchByKeyword(k)));
  for (const list of settled) for (const it of list) byId.set(it.id, it);
  let nat = [...byId.values()];
  if (pref) {
    nat = nat.filter(
      (it) =>
        it.target_area_search === "全国" ||
        (it.target_area_search || "").includes(pref)
    );
  }
  nat.sort((a, b) =>
    (a.acceptance_end_datetime || "").localeCompare(b.acceptance_end_datetime || "")
  );
  const national = nat.slice(0, 40).map((it) => ({
    source: "national" as const,
    id: it.id,
    title: it.title || it.name,
    institution: it.institution_name || "",
    maxLimit: it.subsidy_max_limit || 0,
    area: it.target_area_search || "",
    employees: it.target_number_of_employees || "",
    end: it.acceptance_end_datetime || "",
    url: `https://www.jgrants-portal.go.jp/subsidy/${it.id}`,
  }));

  // 市区町村（東京23区の自前データ）＝実行時オートフレッシュ
  // 締切テキスト（"〜2027/2/26" / "2026-12-28" 等）から実日付を復元し、
  // 過ぎた締切の制度は「募集中」から自動除外（誤情報ゼロを無メンテで維持）。
  let wardItems: unknown[] = [];
  let wardMeta:
    | { name: string; lastChecked?: string; indexUrl?: string; expiredHidden?: number }
    | null = null;
  const wd = ward && pref === "東京都" ? WARDS[ward] : undefined;
  if (wd) {
    const list = purposes.length
      ? wd.subsidies.filter((s) => s.field.some((f) => purposes.includes(f)))
      : wd.subsidies;
    let expiredHidden = 0;
    const mapped = list
      .map((s, i) => {
        const iso = parseDeadlineIso(s.deadline);
        const dLeft = iso ? daysUntil(iso, todayJst) : null;
        return {
          source: "ward" as const,
          id: `${ward}-${i}`,
          title: s.name,
          wardName: ward,
          summary: s.summary || "",
          target: s.target || "",
          maxText: s.maxAmount || "",
          rateText: s.rate || "",
          deadlineText: s.deadline || "",
          deadlineIso: iso,
          daysLeft: dLeft,
          lastChecked: wd.lastChecked || "",
          url: s.url,
        };
      })
      // 締切が実日付で「過去」のものは非表示（通年・予算上限まで・締切未定は残す）
      .filter((it) => {
        if (it.daysLeft !== null && it.daysLeft < 0) {
          expiredHidden++;
          return false;
        }
        return true;
      })
      // 締切が近い順（実日付なし=後ろ）
      .sort((a, b) => {
        const av = a.daysLeft ?? 99999;
        const bv = b.daysLeft ?? 99999;
        return av - bv;
      });
    wardItems = mapped;
    wardMeta = {
      name: ward,
      lastChecked: wd.lastChecked,
      indexUrl: wd.indexUrl,
      expiredHidden,
    };
  }

  return NextResponse.json(
    {
      pref,
      ward: wardMeta,
      wardCount: wardItems.length,
      nationalCount: national.length,
      wardItems,
      items: national,
    },
    { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } }
  );
}
