// SNSパワー診断 — コアロジック
// 名前+SNSから決定論的に結果を生成する（同じ入力=同じ結果）。
// 乱数の消費順を変えると既存のシェアURLの結果が変わるため、
// diagnose() 内の draw 順は絶対に変更しないこと。

export type Sns = "x" | "instagram" | "tiktok";
export type Rarity = "N" | "R" | "SR" | "SSR" | "UR";

export type ShindanResult = {
  name: string;
  sns: Sns;
  rarity: Rarity;
  stats: number[];
  power: number;
  title: string; // 特殊文字フレーム付き称号
  plainTitle: string; // フレーム無し称号（OGP画像用、フォント未収録glyph回避）
  comment: string;
  hidden: boolean; // 隠しランク（戦闘力5）
};

function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function rng(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RARITY: [Rarity, number][] = [
  ["UR", 0.03],
  ["SSR", 0.12],
  ["SR", 0.3],
  ["R", 0.35],
  ["N", 0.2],
];

const MODS = ["深夜の","伝説の","いいね無双の","永遠の","限界化した","沼底の","炎上知らずの","奇跡の","タイムライン界の","推し事極めし","バズり散らかす","隠れ","無敵の","儚き","電光石火の","映え狂いの","フォロバ100の","古のインターネット","令和最強の","気まぐれな","リプ欄の","拡散の","ガチ恋距離の","秒で寝落ちする"];
const CORES = ["覇王","女神","錬金術師","賢者","申し子","守護神","暗殺者","姫","騎士","魔王","妖精","観測者","狂戦士","商人","吟遊詩人","皇帝","予言者","主","勇者","教祖","番人","王子","住人","素材職人"];
const FRAMES: [string, string][] = [["⋆˙⟡ ", " ⟡˙⋆"],["⊹꒰ ", " ꒱⊹"],["✦•┈ ", " ┈•✦"],["⚡️〘 ", " 〙⚡️"],["༺ ", " ༻"],["𓂃𓈒 ", " 𓈒𓂃"],["♱ ", " ♱"],["≪ ", " ≫"]];

export const STATS = ["拡散力", "映え力", "バズ運", "推し愛", "夜行性", "民度"];

const COMMENTS: Record<Rarity, string[]> = {
  UR: ["全SNS界の頂点クラス。あなたが呟けばトレンドが動く。今すぐ何か投稿しましょう。","規格外の電波強度を検知。運営から表彰される日も近い。","この戦闘力は測定器の限界値です。SNSの神に選ばれし者。"],
  SSR: ["かなりの強者。バズの素質が確認されました。あとはきっかけだけ。","フォロワーがあなたの投稿を待っています。今夜が投稿チャンス。","電波の質が高すぎる。インフルエンサーの卵と認定します。"],
  SR: ["安定した実力者。タイムラインの治安をひそかに支えるタイプ。","じわじわ伸びる長期型。半年後が楽しみな逸材です。","フォロワーからの信頼度が高め。リプ欄の空気を作る人。"],
  R: ["平均よりちょい上。たまに出るセンス投稿が光ってます。","本気を出せばまだ伸びる。プロフィールの整備から始めよう。","ROM専に見せかけた実力者。秘めたるバズの種を確認。"],
  N: ["現在は省エネモード。だがそれもまた戦略。","戦闘力は控えめ。でもTLの平和はあなたが守ってる。","充電期間中と判定。次の覚醒イベントに期待。"],
};

export const SCAN_MSGS = ["アカウントをスキャン中...","フォロワー引力を測定中...","バズ係数を解析中...","深夜の投稿履歴を検出中...","推し愛エネルギーを計測中...","映えポテンシャルを展開中...","戦闘力を算出中..."];

export const RARITY_META: Record<Rarity, { sub: string; color: string }> = {
  UR: { sub: "ULTRA RARE!!!", color: "#FFD700" },
  SSR: { sub: "SUPER SPECIAL RARE!!", color: "#FF2E97" },
  SR: { sub: "SUPER RARE!", color: "#B388FF" },
  R: { sub: "RARE", color: "#4FC3F7" },
  N: { sub: "NORMAL", color: "#9aa0b4" },
};

export function diagnose(rawName: string, sns: Sns): ShindanResult {
  const name = rawName.trim();
  const r = rng(hash(name + "|" + sns));
  // draw 1: レアリティ
  const roll = r();
  let acc = 0;
  let rarity: Rarity = "N";
  for (const [k, p] of RARITY) {
    acc += p;
    if (roll < acc) {
      rarity = k;
      break;
    }
  }
  // draw 2: 隠しランク
  const hidden = Math.floor(r() * 1000) === 777;
  // draw 3-8: ステータス
  const base = { UR: 78, SSR: 64, SR: 50, R: 36, N: 22 }[rarity];
  const stats = STATS.map(() =>
    Math.min(99, Math.max(3, Math.round(base + (r() * 2 - 1) * 22)))
  );
  const bias = { x: 0, instagram: 1, tiktok: 2 }[sns];
  stats[bias] = Math.min(99, stats[bias] + 8);
  // draw 9: 戦闘力
  const range = {
    UR: [2000000, 9999999],
    SSR: [500000, 1999999],
    SR: [100000, 499999],
    R: [10000, 99999],
    N: [1000, 9999],
  }[rarity];
  let power = Math.round(range[0] + r() * (range[1] - range[0]));
  if (hidden) power = 5;
  // draw 10-12: 称号
  const f = FRAMES[Math.floor(r() * FRAMES.length)];
  const mod = MODS[Math.floor(r() * MODS.length)];
  const core = CORES[Math.floor(r() * CORES.length)];
  const title = f[0] + mod + core + f[1];
  const plainTitle = mod + core;
  // draw 13: コメント
  const cm = COMMENTS[rarity];
  const comment = hidden
    ? "……戦闘力、たったの5。だが歴戦の猛者ほど力を隠すという。あなたはTLを耕す側の人間だ。"
    : cm[Math.floor(r() * cm.length)];
  return { name, sns, rarity, stats, power, title, plainTitle, comment, hidden };
}

/* ===== シェアURL用 slug（URLセーフbase64、ブラウザ/Node両対応） ===== */

export function encodeSlug(name: string, sns: Sns): string {
  const raw = `${name.trim()}|${sns}`;
  const bytes = new TextEncoder().encode(raw);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  const b64 =
    typeof btoa !== "undefined"
      ? btoa(bin)
      : Buffer.from(bin, "binary").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeSlug(
  slug: string
): { name: string; sns: Sns } | null {
  try {
    const b64 =
      slug.replace(/-/g, "+").replace(/_/g, "/") +
      "=".repeat((4 - (slug.length % 4)) % 4);
    const bin =
      typeof atob !== "undefined"
        ? atob(b64)
        : Buffer.from(b64, "base64").toString("binary");
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const raw = new TextDecoder().decode(bytes);
    const i = raw.lastIndexOf("|");
    if (i < 1) return null;
    const name = raw.slice(0, i).trim().slice(0, 20);
    const sns = raw.slice(i + 1);
    if (!name || !["x", "instagram", "tiktok"].includes(sns)) return null;
    return { name, sns: sns as Sns };
  } catch {
    return null;
  }
}

export const SNS_LABEL: Record<Sns, string> = {
  x: "X",
  instagram: "Instagram",
  tiktok: "TikTok",
};
