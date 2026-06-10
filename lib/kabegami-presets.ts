// 推しメンカラ壁紙メーカー — グループプリセット
//
// メンバーカラーは公式発表・ファン定着情報をWeb上の複数ソースで照合したもの。
// 非公式ファンメイドツールとして名前とカラー（事実情報）のみを扱い、
// 写真・ロゴ・公式ロゴタイプは一切使用しない。UI側で全データ編集可能。
//
// 確度メモ:
// - STARTO各組 / JO1 / INI / ME:I / NiziU: 複数ソースで照合済み
// - TWICE: #TWICE3 IDカード由来のカラーコード（公式言及はないがファン定着）
// - K-POPの多く（BTS/SEVENTEEN等）は公式メンカラ不在のため収録しない（捏造防止）

export type KbMember = { name: string; color: string };
export type KbPreset = { label: string; members: KbMember[] };

export const KB_PRESETS: Record<string, KbPreset> = {
  sample: {
    label: "⊹ サンプル",
    members: [
      { name: "ひかり", color: "#FF5C8A" },
      { name: "そら", color: "#4FA3FF" },
      { name: "ゆず", color: "#FFC24B" },
      { name: "わかば", color: "#4CD964" },
      { name: "れん", color: "#9D6BFF" },
      { name: "あかね", color: "#FF4D4D" },
      { name: "しずく", color: "#3DDAD7" },
    ],
  },
  snowman: {
    label: "Snow Man",
    members: [
      { name: "岩本照", color: "#FFD60A" },
      { name: "深澤辰哉", color: "#AF52DE" },
      { name: "ラウール", color: "#F5F5F7" },
      { name: "渡辺翔太", color: "#0A84FF" },
      { name: "向井康二", color: "#FF9500" },
      { name: "阿部亮平", color: "#34C759" },
      { name: "目黒蓮", color: "#1C1C1E" },
      { name: "宮舘涼太", color: "#FF3B30" },
      { name: "佐久間大介", color: "#FF7EB6" },
    ],
  },
  sixtones: {
    label: "SixTONES",
    members: [
      { name: "ジェシー", color: "#FF3B30" },
      { name: "京本大我", color: "#FF7EB6" },
      { name: "松村北斗", color: "#1C1C1E" },
      { name: "髙地優吾", color: "#FFD60A" },
      { name: "森本慎太郎", color: "#34C759" },
      { name: "田中樹", color: "#0A84FF" },
    ],
  },
  naniwa: {
    label: "なにわ男子",
    members: [
      { name: "西畑大吾", color: "#FF3B30" },
      { name: "大西流星", color: "#FF9500" },
      { name: "道枝駿佑", color: "#FF7EB6" },
      { name: "高橋恭平", color: "#AF52DE" },
      { name: "長尾謙杜", color: "#FFD60A" },
      { name: "藤原丈一郎", color: "#0A84FF" },
      { name: "大橋和也", color: "#34C759" },
    ],
  },
  travis: {
    label: "Travis Japan",
    members: [
      { name: "宮近海斗", color: "#FF3B30" },
      { name: "中村海人", color: "#34C759" },
      { name: "七五三掛龍也", color: "#FF7EB6" },
      { name: "川島如恵留", color: "#F5F5F7" },
      { name: "吉澤閑也", color: "#FFD60A" },
      { name: "松田元太", color: "#0A84FF" },
      { name: "松倉海斗", color: "#FF9500" },
    ],
  },
  kingprince: {
    label: "King & Prince",
    members: [
      { name: "永瀬廉", color: "#1C1C1E" },
      { name: "髙橋海人", color: "#FFD60A" },
    ],
  },
  timelesz: {
    label: "timelesz",
    members: [
      { name: "佐藤勝利", color: "#FF3B30" },
      { name: "菊池風磨", color: "#AF52DE" },
      { name: "松島聡", color: "#34C759" },
      { name: "寺西拓人", color: "#5AC8FA" },
      { name: "原嘉孝", color: "#A4E400" },
      { name: "橋本将生", color: "#FF7EB6" },
      { name: "猪俣周杜", color: "#FFD60A" },
      { name: "篠塚大輝", color: "#F5F5F7" },
    ],
  },
  west: {
    label: "WEST.",
    members: [
      { name: "重岡大毅", color: "#FF3B30" },
      { name: "桐山照史", color: "#FF9500" },
      { name: "中間淳太", color: "#FFD60A" },
      { name: "神山智洋", color: "#34C759" },
      { name: "藤井流星", color: "#0A84FF" },
      { name: "濵田崇裕", color: "#AF52DE" },
      { name: "小瀧望", color: "#FF7EB6" },
    ],
  },
  jo1: {
    label: "JO1",
    members: [
      { name: "與那城奨", color: "#34C759" },
      { name: "白岩瑠姫", color: "#F5F5F7" },
      { name: "川尻蓮", color: "#0A84FF" },
      { name: "川西拓実", color: "#FF7EB6" },
      { name: "大平祥生", color: "#FFD60A" },
      { name: "鶴房汐恩", color: "#8E8E93" },
      { name: "木全翔也", color: "#C9A7F5" },
      { name: "河野純喜", color: "#5AC8FA" },
      { name: "金城碧海", color: "#1C1C1E" },
      { name: "佐藤景瑚", color: "#C19A6B" },
      { name: "豆原一成", color: "#FF3B30" },
    ],
  },
  ini: {
    label: "INI",
    members: [
      { name: "木村柾哉", color: "#FFD60A" },
      { name: "田島将吾", color: "#34C759" },
      { name: "尾崎匠海", color: "#FF9500" },
      { name: "西洸人", color: "#1C1C1E" },
      { name: "髙塚大夢", color: "#5AC8FA" },
      { name: "藤牧京介", color: "#0A84FF" },
      { name: "松田迅", color: "#FF3B30" },
      { name: "池﨑理人", color: "#1D3F8F" },
      { name: "佐野雄大", color: "#FF7EB6" },
      { name: "許豊凡", color: "#AF52DE" },
      { name: "後藤威尊", color: "#F5F5F7" },
    ],
  },
  mei: {
    label: "ME:I",
    members: [
      { name: "笠原桃奈", color: "#1C1C1E" },
      { name: "飯田栞月", color: "#F5F5F7" },
      { name: "石井蘭", color: "#FF3B30" },
      { name: "加藤心", color: "#5AC8FA" },
      { name: "高見文寧", color: "#FFD60A" },
      { name: "海老原鼓", color: "#FF9500" },
      { name: "山本すず", color: "#FFC2D8" },
      { name: "村上璃杏", color: "#FF2E97" },
      { name: "佐々木心菜", color: "#AF52DE" },
      { name: "櫻井美羽", color: "#C9A7F5" },
      { name: "清水恵子", color: "#C7CCD6" },
    ],
  },
  niziu: {
    label: "NiziU",
    members: [
      { name: "MAKO", color: "#FF9500" },
      { name: "RIO", color: "#5AC8FA" },
      { name: "MAYA", color: "#AF52DE" },
      { name: "RIKU", color: "#FFD60A" },
      { name: "AYAKA", color: "#F5F5F7" },
      { name: "MAYUKA", color: "#A4E400" },
      { name: "RIMA", color: "#FF3B30" },
      { name: "MIIHI", color: "#FF7EB6" },
      { name: "NINA", color: "#0A84FF" },
    ],
  },
  twice: {
    label: "TWICE",
    members: [
      { name: "ナヨン", color: "#5BC2E7" },
      { name: "ジョンヨン", color: "#C5D97A" },
      { name: "モモ", color: "#FF8DA1" },
      { name: "サナ", color: "#9B7DD4" },
      { name: "ジヒョ", color: "#FFC56E" },
      { name: "ミナ", color: "#6DCDB8" },
      { name: "ダヒョン", color: "#FFFFFF" },
      { name: "チェヨン", color: "#EE2737" },
      { name: "ツウィ", color: "#005EB8" },
    ],
  },
  momoclo: {
    label: "ももクロ",
    members: [
      { name: "百田夏菜子", color: "#FF3B30" },
      { name: "玉井詩織", color: "#FFD60A" },
      { name: "佐々木彩夏", color: "#FF7EB6" },
      { name: "高城れに", color: "#AF52DE" },
    ],
  },
};
