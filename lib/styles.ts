// デコ文字変換ロジック
// MVPのstyles/decorators/framesを移植し、型付け

export type StyleCategory = "cute" | "cool" | "small" | "frame";

export type FontStyle = {
  key: string;
  name: string;
  category: StyleCategory;
  upper: string;
  lower: string;
  num: string;
};

export type Decorator = {
  key: string;
  name: string;
  category: StyleCategory;
  wrap: (t: string) => string;
};

// フォントスタイル（Mathematical Alphanumeric Symbols 等を活用）
export const fontStyles: FontStyle[] = [
  {
    key: "bold-script",
    name: "筆記体 ✎",
    category: "cute",
    upper: "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩",
    lower: "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃",
    num: "0123456789",
  },
  {
    key: "fraktur",
    name: "黒文字 ✦",
    category: "cool",
    upper: "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ",
    lower: "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷",
    num: "0123456789",
  },
  {
    key: "double",
    name: "ダブル文字",
    category: "cool",
    upper: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ",
    lower: "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫",
    num: "𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡",
  },
  {
    key: "mono",
    name: "等幅 ▣",
    category: "cool",
    upper: "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉",
    lower: "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣",
    num: "𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿",
  },
  {
    key: "bold-italic",
    name: "ボールド斜体",
    category: "cool",
    upper: "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁",
    lower: "𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛",
    num: "0123456789",
  },
  {
    key: "sans-bold",
    name: "サンセリフ太字",
    category: "cool",
    upper: "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭",
    lower: "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇",
    num: "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵",
  },
  {
    key: "circle",
    name: "まる文字 ○",
    category: "cute",
    upper: "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ",
    lower: "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ",
    num: "⓪①②③④⑤⑥⑦⑧⑨",
  },
  {
    key: "square",
    name: "しかく文字 □",
    category: "cute",
    upper: "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉",
    lower: "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉",
    num: "0123456789",
  },
  {
    key: "square-fill",
    name: "しかく文字 ■",
    category: "cool",
    upper: "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉",
    lower: "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉",
    num: "0123456789",
  },
  {
    key: "fullwidth",
    name: "全角",
    category: "cute",
    upper: "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ",
    lower: "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ",
    num: "０１２３４５６７８９",
  },
  {
    key: "small-caps",
    name: "ちいさめ大文字",
    category: "small",
    upper: "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ",
    lower: "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ",
    num: "0123456789",
  },
  {
    key: "superscript",
    name: "上付き",
    category: "small",
    upper: "ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ",
    lower: "ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ",
    num: "⁰¹²³⁴⁵⁶⁷⁸⁹",
  },
  {
    key: "subscript",
    name: "下付き",
    category: "small",
    upper: "ₐbcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyz",
    lower: "ₐbcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyz",
    num: "₀₁₂₃₄₅₆₇₈₉",
  },
];

// 装飾デコレーター（テキストを囲む系）
export const decorators: Decorator[] = [
  { key: "heart", name: "♡ハート", category: "frame", wrap: (t) => `♡${t}♡` },
  { key: "star", name: "✦スター", category: "frame", wrap: (t) => `✦ ${t} ✦` },
  { key: "flower", name: "✿フラワー", category: "frame", wrap: (t) => `✿ ${t} ✿` },
  { key: "sparkle", name: "✧キラキラ", category: "frame", wrap: (t) => `⋆｡˚⋆ ${t} ⋆˚｡⋆` },
  { key: "ribbon", name: "リボン", category: "frame", wrap: (t) => `꒰ ${t} ꒱` },
  { key: "bracket-cute", name: "かわいいカッコ", category: "frame", wrap: (t) => `⊹˚. ${t} .˚⊹` },
  { key: "cloud", name: "もこもこ", category: "frame", wrap: (t) => `☁︎ ${t} ☁︎` },
  { key: "kira", name: "キラ盛り", category: "frame", wrap: (t) => `✩°｡⋆⸜ ${t} ⸝⋆｡°✩` },
  { key: "paw", name: "肉球", category: "frame", wrap: (t) => `୨୧ ${t} ୨୧` },
  { key: "spaced", name: "すきま空け", category: "frame", wrap: (t) => t.split("").join(" ") },
];

// 装飾フレーム（プロフィールの上下に挟む系）
export const frames: string[] = [
  "┈┈┈┈┈┈♡┈┈┈┈┈┈",
  "⋆｡‧˚ʚ♡ɞ˚‧｡⋆",
  "✦ ───── ⋆⋅☆⋅⋆ ───── ✦",
  "╭─────୨ৎ─────╮",
  "⊹｡✧♡✧｡⊹",
  "⋆˚࿔ ⋆.˚ ⋆˚࿔",
  "· · ─ ── ✦ ── ─ · ·",
  "🌸 ・ 。 ・ 🌸 ・ 。 ・ 🌸",
  "꧁ ━━━━━━ ꧂",
  "⋆ ˚｡⋆୨ৎ˚ ⋆.˚",
  "✿ ❀ ✿ ❀ ✿ ❀ ✿",
  "★彡 ━━━━━━ 彡★",
  "↳ ⋆｡˚ ━━━━━ ｡˚⋆",
  "⌗・⌗・⌗・⌗・⌗",
  "☁︎｡⋆｡ ‧ ° ☾ ° ‧ ｡⋆｡☁︎",
];

// 1文字変換
function convertChar(
  ch: string,
  mapUpper: string,
  mapLower: string,
  mapNum: string
): string {
  // 数字
  if (ch >= "0" && ch <= "9") {
    const i = ch.charCodeAt(0) - 48;
    return Array.from(mapNum)[i] || ch;
  }
  // 大文字
  if (ch >= "A" && ch <= "Z") {
    const i = ch.charCodeAt(0) - 65;
    return Array.from(mapUpper)[i] || ch;
  }
  // 小文字
  if (ch >= "a" && ch <= "z") {
    const i = ch.charCodeAt(0) - 97;
    return Array.from(mapLower)[i] || ch;
  }
  return ch;
}

// テキスト全体変換
export function transformText(text: string, style: FontStyle): string {
  return Array.from(text)
    .map((ch) => convertChar(ch, style.upper, style.lower, style.num))
    .join("");
}
