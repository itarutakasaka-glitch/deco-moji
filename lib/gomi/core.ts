// ゴミ出し占い — コアロジック
// 収集日エンジン（目黒区公式データ準拠）＋ 占いエンジン（軸の掛け算：断捨離×風水×ネタ）。
// 占いは「日付＋エリア＋今日のごみ種別」をシードに決定論的に生成（同じ日=同じ結果）。
// /shindan と同じ hash + mulberry32 方式。draw 順を変えると過去のシェアURLの結果が変わるので注意。

import schedule from "./meguro-schedule.json";

/* ===== 型 ===== */
export type WeeklyRule = { kind: "weekly"; weekdays: number[] };
export type NthRule = { kind: "nthWeekday"; weekday: number; nths: number[] };
export type Rule = WeeklyRule | NthRule;

export type GomiKey =
  | "burnable"
  | "recyclable"
  | "paper"
  | "nonBurnable"
  | "mercury";

type AreaRaw = {
  group: string;
  chome: string[];
  burnable?: Rule;
  recyclable?: Rule;
  paper?: Rule;
  nonBurnable?: Rule;
  mercury?: Rule;
};

export type Rarity = "N" | "R" | "SR" | "SSR" | "UR";
export type Element = "火" | "水" | "木" | "金" | "光" | "無";

export type GomiTypeMeta = {
  label: string;
  em: string;
  cls: string;
  rarity: Rarity;
  element: Element;
};

export const TYPES: Record<GomiKey, GomiTypeMeta> = {
  burnable: { label: "燃やすごみ", em: "🔥", cls: "t-burn", rarity: "R", element: "火" },
  recyclable: { label: "びん・缶・ペットボトル", em: "♻️", cls: "t-recy", rarity: "SR", element: "水" },
  paper: { label: "古紙", em: "📰", cls: "t-paper", rarity: "SR", element: "木" },
  nonBurnable: { label: "燃やさないごみ", em: "🔩", cls: "t-non", rarity: "SSR", element: "金" },
  mercury: { label: "水銀を含む製品", em: "🔆", cls: "t-merc", rarity: "UR", element: "光" },
};

// 画面表示順／テーマ採用優先順（レアな種別ほどその日のテーマに採用）
export const ORDER: GomiKey[] = ["burnable", "recyclable", "paper", "nonBurnable", "mercury"];
const PRIORITY: GomiKey[] = ["mercury", "nonBurnable", "paper", "recyclable", "burnable"];
export const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

/* ===== MVP対象エリア：上目黒四丁目 ===== */
export const MVP_CHOME = "上目黒四丁目";
const AREAS = schedule.areas as unknown as AreaRaw[];
const MVP_AREA =
  AREAS.find((a) => a.chome.includes(MVP_CHOME)) ?? AREAS[0];

export const SCHEDULE_SOURCE = {
  municipality: schedule.municipality as string,
  source: schedule.source as string,
  fetchedAt: schedule.fetchedAt as string,
};

/* ===== 日付パーツ（タイムゾーン非依存） ===== */
export type DateParts = { y: number; m: number; d: number };

export function partsFromDate(date: Date): DateParts {
  return { y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate() };
}
export function partsFromIso(iso: string): DateParts | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, m: mo, d };
}
const pad = (n: number) => String(n).padStart(2, "0");
export const isoOf = (p: DateParts) => `${p.y}-${pad(p.m)}-${pad(p.d)}`;
// UTC を使い、ローカルTZに左右されない曜日・加算を得る
const utc = (p: DateParts) => Date.UTC(p.y, p.m - 1, p.d);
export const dowOf = (p: DateParts) => new Date(utc(p)).getUTCDay();
export const nthOf = (p: DateParts) => Math.floor((p.d - 1) / 7) + 1;
export function addDays(p: DateParts, n: number): DateParts {
  const dt = new Date(utc(p) + n * 86400000);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}
export const fmtShort = (p: DateParts) => `${p.m}/${p.d}(${WEEK[dowOf(p)]})`;
export const fmtLong = (p: DateParts) =>
  `${p.y}年${p.m}月${p.d}日(${WEEK[dowOf(p)]})`;

/* ===== 収集日エンジン ===== */
export function matchesRule(rule: Rule | undefined, p: DateParts): boolean {
  if (!rule) return false;
  if (rule.kind === "weekly") return rule.weekdays.includes(dowOf(p));
  // nthWeekday: 第5週は nths に含めないため自動的に除外される（区注記どおり）
  return dowOf(p) === rule.weekday && rule.nths.includes(nthOf(p));
}
export function typesOn(p: DateParts): GomiKey[] {
  return ORDER.filter((k) => matchesRule(MVP_AREA[k], p));
}
export function nextOccurrence(key: GomiKey, from: DateParts): DateParts | null {
  let p = from;
  for (let i = 0; i < 70; i++) {
    if (matchesRule(MVP_AREA[key], p)) return p;
    p = addDays(p, 1);
  }
  return null;
}
export function describeRule(rule: Rule | undefined): string {
  if (!rule) return "—";
  if (rule.kind === "weekly")
    return "毎週 " + rule.weekdays.map((w) => WEEK[w]).join("・") + "曜";
  return "第" + rule.nths.join("・") + " " + WEEK[rule.weekday] + "曜";
}
export function ruleFor(key: GomiKey): Rule | undefined {
  return MVP_AREA[key];
}

// 年末年始（12/29〜1/3）は特別日程＝通常ルールが当てにならないので警告を出す
export function isYearEndPeriod(p: DateParts): boolean {
  return (p.m === 12 && p.d >= 29) || (p.m === 1 && p.d <= 3);
}

export type NextItem = { key: GomiKey; date: DateParts | null; days: number | null };
export function nextSchedule(p: DateParts): NextItem[] {
  return ORDER.map((key) => {
    const date = nextOccurrence(key, p);
    const days = date
      ? Math.round((utc(date) - utc(p)) / 86400000)
      : null;
    return { key, date, days };
  });
}

/* ===== シード乱数（/shindan と同じ作法） ===== */
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

/* ===== 占いプール（軸の掛け算：ごみ種別=テーマ × 断捨離 × 風水 × ネタ） ===== */
const COMMANDS: Record<Element, string[]> = {
  火: [
    "賞味期限切れの調味料を1つ、思い切って燃やすごみへ。胃と運気の“消化”が良くなる🔥",
    "読み終わらない雑誌を手放す。火の気が巡り、止まっていた恋がじわっと動き出す",
    "溜め込んだ割り箸・使い捨てスプーンを処分。“もったいない”の呪いが解ける日",
    "枯れた葉・しおれた花を落とす。新しい芽＝新しいチャンスのスペースが空く",
    "焦げついたスポンジを卒業。金運の“焦げつき”も一緒にリセットされる",
    "去年の手帳の“もう見ないページ”を破って手放す。過去のモヤモヤが燃え尽きる",
  ],
  水: [
    "空きペットボトルを“今日ぜんぶ”出す。淀んだ水の気が流れ、金運の循環が始まる💧",
    "シンク下の空き瓶コレクションを解放。停滞していた人間関係が動き出す",
    "飲みかけで放置した缶を処分。中途半端にしてた“あの件”も片づく予感",
    "ラベルを剥がし、洗って、乾かして出す——その丁寧さが今日の対人運を磨く✨",
    "気の抜けた炭酸飲料を流す。惰性で続けてた習慣も一緒に手放せる",
    "増えすぎたマイボトルを1本だけ厳選。“循環する器”だけ残すと金運が澄む",
  ],
  木: [
    "積読のチラシ・DMの山を古紙へ。情報の渋滞が消え、頭がクリアになる📦",
    "もう使わない取扱説明書を手放す。“いつか”への執着が一つ軽くなる",
    "段ボールを潰して出す。空間が広がるほど、入ってくる縁も広がる",
    "去年の書類の“もう不要”を束ねる。過去の清算が、新しい金運を呼ぶ",
    "読み返さない手紙やノートを古紙に。心の引き出しに新しい余白ができる",
    "紙袋ストックを“好きな3枚”に絞る。選ぶ力が、今日の決断運を上げる",
  ],
  金: [
    "割れたグラス・欠けた食器を“今日”手放す。欠けた縁も一緒に断ち切れる🔩",
    "片方だけのイヤホン・壊れた小物を処分。決断力が戻り、迷いが晴れる",
    "使わない金属小物を選別。金の気が整い、臨時収入のアンテナが立つ",
    "錆びたヘアピン・切れ味の落ちた爪切りを処分。古い“切れ味”を手放す日",
    "電池切れのおもちゃ・小型家電を整理。動かないものを手放すと、運も動く",
    "“いつか直す”の壊れ物に別れを。保留が消えると、新しい機会が滑り込む",
  ],
  光: [
    "古い電池・切れた蛍光灯を“水銀を含む製品”として正しく出す。月イチの隠れ毒出しデー🔆",
    "眠った体温計・水銀温度計を手放す。淀みの“元栓”が抜ける、特別な浄化の日",
    "ボタン電池・ライターを正規ルートで処分。安全＝最強の開運。ここを侮る者に福は来ない",
    "今日を逃すと次の“水銀回”は約1か月後。レアな浄化チャンスを取り逃すな⚡",
    "光モノ（鏡・古い照明）の埃を払い、危険物は分別へ。視界とともに未来が明るくなる",
  ],
  無: [
    "今日は収集なし。“出さない勇気”の日。溜まったゴミ＝伸びしろと捉えて充電せよ🔋",
    "回収がない朝こそ分別の仕込み時。明日出す袋を一つ準備すれば、運の先取り",
    "ゴミ出しがない日は、机の上の小さな一角だけ整える。小さな整いが大吉を呼ぶ",
    "何も出せない日は“買わない練習”の日。増やさない者だけが、軽やかに前へ進む",
  ],
};
const DIRS = [
  { n: "北", i: "🧭" }, { n: "北東", i: "🧭" }, { n: "東", i: "🌅" }, { n: "南東", i: "🌤️" },
  { n: "南", i: "☀️" }, { n: "南西", i: "🌇" }, { n: "西", i: "🌙" }, { n: "北西", i: "⛰️" },
];
const COLORS = [
  { n: "ゴールド", c: "#FFD700" }, { n: "ターコイズ", c: "#00E5FF" }, { n: "ローズピンク", c: "#FF6FA5" },
  { n: "ミントグリーン", c: "#5BE7A9" }, { n: "ロイヤルパープル", c: "#9D4EDD" }, { n: "パールホワイト", c: "#F4F0FF" },
  { n: "サンセットオレンジ", c: "#FF7A45" }, { n: "スカイブルー", c: "#4FC3F7" },
];
const ITEMS = [
  { n: "観葉植物", i: "🪴" }, { n: "粗塩ひとつまみ", i: "🧂" }, { n: "手鏡", i: "🪞" }, { n: "白いタオル", i: "🤍" },
  { n: "小銭入れ", i: "👛" }, { n: "アロマの香り", i: "🕯️" }, { n: "水晶", i: "🔮" }, { n: "炭", i: "🪵" }, { n: "鈴の音", i: "🔔" },
];
const NG = [
  "玄関に空き箱を置きっぱなしにすること。良い気の入口を塞ぐ",
  "ゴミ袋を結ばずに放置すること。運気もそこから漏れ出す",
  "レジ袋を溜め込むこと。“いつか使う”は、たいてい来ない",
  "“あとで分別”を信じること。未来の自分は今日より忙しい",
  "冷蔵庫の奥を見て見ぬふり。淀みは奥から生まれる",
  "ギリギリ出しでダッシュすること。慌てた朝に福は宿らない",
];
const NETA = [
  "ゴミを制する者は、人生を制す。いってらっしゃい🗑️✨",
  "今日のあなたの分別、神は見てる。",
  "出し忘れた者にだけ、来週の業（カルマ）が二倍に積まれる。",
  "分別できる人は、人の気持ちも分別できる（してない）。",
  "正しく出せた朝のあなたは、ちょっとだけ良い人間。",
  "可燃の心、不滅の運。",
  "袋を結ぶその手つきで、今日の運命が決まる。",
];
export type Rank = { t: string; s: string; cls: string; conf: boolean };
const RANKS: Rank[] = [
  { t: "神回収", s: "最高にツイてる", cls: "ur", conf: true },
  { t: "大吉", s: "分別の神", cls: "gold", conf: true },
  { t: "中吉", s: "ゴミ運上々", cls: "pink", conf: false },
  { t: "小吉", s: "まずまず可燃", cls: "cyan", conf: false },
  { t: "末吉", s: "じわじわ整う", cls: "purple", conf: false },
  { t: "燃え吉", s: "伸びしろの塊", cls: "n", conf: false },
];

/* ===== 占い生成 ===== */
export type Fortune = {
  iso: string;
  parts: DateParts;
  dateLong: string;
  area: string;
  today: GomiKey[];
  themeKey: GomiKey | null;
  element: Element;
  rarity: Rarity;
  rank: Rank;
  command: string;
  dir: { n: string; i: string };
  color: { n: string; c: string };
  item: { n: string; i: string };
  ng: string;
  neta: string;
  luckyNum: number;
  luckyHour: number;
  next: NextItem[];
  yearEnd: boolean;
};

export function buildFortune(p: DateParts): Fortune {
  const today = typesOn(p);
  const themeKey = PRIORITY.find((k) => today.includes(k)) ?? null;
  const element: Element = themeKey ? TYPES[themeKey].element : "無";
  const rarity: Rarity = themeKey ? TYPES[themeKey].rarity : "N";
  const iso = isoOf(p);
  const r = rng(hash(iso + "|kamimeguro4|" + (themeKey ?? "none")));

  let rank: Rank;
  if (themeKey === "mercury") rank = RANKS[0];
  else if (themeKey === "nonBurnable") rank = r() < 0.6 ? RANKS[1] : RANKS[2];
  else if (!themeKey) rank = r() < 0.5 ? RANKS[4] : RANKS[5];
  else rank = pick(r, RANKS.slice(1));

  const command = pick(r, COMMANDS[element]);
  const dir = pick(r, DIRS);
  const color = pick(r, COLORS);
  const item = pick(r, ITEMS);
  const ng = pick(r, NG);
  const neta = pick(r, NETA);
  const luckyNum = Math.floor(r() * 100);
  const luckyHour = Math.floor(r() * 24);

  return {
    iso,
    parts: p,
    dateLong: fmtLong(p),
    area: MVP_CHOME,
    today,
    themeKey,
    element,
    rarity,
    rank,
    command,
    dir,
    color,
    item,
    ng,
    neta,
    luckyNum,
    luckyHour,
    next: nextSchedule(p),
    yearEnd: isYearEndPeriod(p),
  };
}

/* ===== シェアURL用 slug（日付 yyyymmdd をURLセーフに） ===== */
export function encodeSlug(p: DateParts): string {
  return `${p.y}${pad(p.m)}${pad(p.d)}`;
}
export function decodeSlug(slug: string): DateParts | null {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(slug);
  if (!m) return null;
  const p = { y: +m[1], m: +m[2], d: +m[3] };
  if (p.m < 1 || p.m > 12 || p.d < 1 || p.d > 31) return null;
  // 往復で一致しない値（2月30日など）は弾く
  const dt = new Date(Date.UTC(p.y, p.m - 1, p.d));
  if (dt.getUTCMonth() + 1 !== p.m || dt.getUTCDate() !== p.d) return null;
  return p;
}

export const RARITY_LABEL: Record<Rarity, string> = {
  N: "N", R: "R", SR: "SR", SSR: "SSR", UR: "UR",
};
