// デコ文字相性診断 — コアロジック
// 2人の名前から決定論的に相性を生成する（同じ組み合わせ=同じ結果。順序は不問）。
// /shindan と同じ hash + mulberry32 方式。draw 順を変えると既存シェアURLの結果が変わるので注意。

export type Tier = "destiny" | "love" | "good" | "growing" | "trial" | "training";

export type CompatResult = {
  nameA: string;
  nameB: string;
  score: number; // 0-100
  tier: Tier;
  tierLabel: string;
  tierEmoji: string;
  comment: string;
  advice: string;
  decoWord: string; // コピペできるデコ文字メッセージ
  luckyDate: string; // ネタのラッキーデート
};

function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
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
const pick = <T>(r: () => number, a: T[]): T => a[Math.floor(r() * a.length)];

export const TIER_META: Record<
  Tier,
  { label: string; emoji: string; cls: string; min: number }
> = {
  destiny: { label: "運命の二人", emoji: "💞", cls: "destiny", min: 95 },
  love: { label: "相思相愛", emoji: "💖", cls: "love", min: 80 },
  good: { label: "いい感じ", emoji: "😊", cls: "good", min: 60 },
  growing: { label: "これから次第", emoji: "🌱", cls: "growing", min: 40 },
  trial: { label: "試練の予感", emoji: "🌀", cls: "trial", min: 20 },
  training: { label: "修行が必要", emoji: "🔥", cls: "training", min: 0 },
};

function tierOf(score: number): Tier {
  const order: Tier[] = ["destiny", "love", "good", "growing", "trial", "training"];
  for (const t of order) if (score >= TIER_META[t].min) return t;
  return "training";
}

const COMMENTS: Record<Tier, string[]> = {
  destiny: [
    "星のめぐりが二人を選んだ。並んで歩くだけで景色が輝くレベル。",
    "言葉がいらない阿吽の呼吸。出会えた時点で大勝利の二人。",
    "運命メーターが振り切れました。手を離さないで。",
  ],
  love: [
    "見つめ合えば伝わる、温度の合う二人。けんかも仲直りも上手。",
    "一緒にいるほど好きが育つタイプ。週末の予定、もう立てた？",
    "お互いの“好き”の周波数がぴったり。いい関係です。",
  ],
  good: [
    "テンポの合う心地よい関係。小さな気遣いで一気に伸びる。",
    "今は腹八分の好相性。ちょっとの勇気で“いい感じ”が加速する。",
    "笑いのツボが近い二人。一緒にいて疲れないのが強み。",
  ],
  growing: [
    "伸びしろは無限大。違いを面白がれたら化ける関係。",
    "今は土を耕す時期。焦らず水をやれば、ちゃんと芽が出る。",
    "すれ違いも栄養。お互いを知るほど相性は上書きされる。",
  ],
  trial: [
    "嵐の予感。でも乗り越えた二人ほど絆は太くなる。",
    "今はタイミングが噛み合わないだけ。間（ま）を大事に。",
    "正直さが試される時。気持ちを言葉にできたら流れが変わる。",
  ],
  training: [
    "修行スタート。ここから上がるしかないとも言える。",
    "今日の相性は控えめ。でも数字は出し方ひとつで化ける。",
    "距離感の取り直しが吉。無理せず、まずは挨拶から。",
  ],
};
const ADVICE = [
  "今日は相手の話を最後まで聞く日にしてみて。",
  "“ありがとう”を一回多めに言うと運気が上がる。",
  "おそろいの小物を一つ持つと縁が強まる。",
  "next の予定を先に決めた方が勝ち。",
  "甘いものを半分こすると距離が縮まる。",
  "既読より、ひとことの返信が効く日。",
  "相手の好きな色を today 取り入れてみよう。",
];
const DECO_WORDS = [
  "˗ˏˏ ♡ ずっと一緒 ♡ ˎˊ˗",
  "⋆｡˚ relationship goals ˚｡⋆",
  "꒰ ⑅ two of us ⑅ ꒱",
  "✧･ﾟ: 相性∞ :ﾟ･✧",
  "♱ destiny ♱",
  "⊹ ࣪ ˖ きみとなら ˖ ࣪ ⊹",
  "❛ ❜ best pair ❛ ❜",
  "𓂃 ⋆ ふたりの未来 ⋆ 𓂃",
];
const LUCKY_DATES = [
  "満月の夜","雨上がりの夕方","三連休の中日","金曜の21時","新月の朝","花火の日","初雪の日","二人の記念日",
];

export function diagnoseCompat(rawA: string, rawB: string): CompatResult {
  const a = rawA.trim();
  const b = rawB.trim();
  // 順序不問：ソートしてからシード化（A+B と B+A を同じ結果に）
  const key = [a, b].sort().join("|");
  const r = rng(hash(key));
  // draw 1: スコア
  const score = Math.floor(r() * 101);
  const tier = tierOf(score);
  // draw 2: コメント
  const comment = pick(r, COMMENTS[tier]);
  // draw 3: アドバイス
  const advice = pick(r, ADVICE);
  // draw 4: デコ文字メッセージ
  const decoWord = pick(r, DECO_WORDS);
  // draw 5: ラッキーデート
  const luckyDate = pick(r, LUCKY_DATES);
  return {
    nameA: a,
    nameB: b,
    score,
    tier,
    tierLabel: TIER_META[tier].label,
    tierEmoji: TIER_META[tier].emoji,
    comment,
    advice,
    decoWord,
    luckyDate,
  };
}

/* ===== シェアURL用 slug（URLセーフbase64、ブラウザ/Node両対応） ===== */
export function encodeSlug(a: string, b: string): string {
  const raw = `${a.trim()}|${b.trim()}`;
  const bytes = new TextEncoder().encode(raw);
  let bin = "";
  bytes.forEach((x) => (bin += String.fromCharCode(x)));
  const b64 =
    typeof btoa !== "undefined" ? btoa(bin) : Buffer.from(bin, "binary").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export function decodeSlug(slug: string): { a: string; b: string } | null {
  try {
    const b64 =
      slug.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (slug.length % 4)) % 4);
    const bin =
      typeof atob !== "undefined" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const raw = new TextDecoder().decode(bytes);
    const i = raw.indexOf("|");
    if (i < 1) return null;
    const a = raw.slice(0, i).trim().slice(0, 20);
    const b = raw.slice(i + 1).trim().slice(0, 20);
    if (!a || !b) return null;
    return { a, b };
  } catch {
    return null;
  }
}
