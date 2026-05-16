// サイト全体の設定（環境変数や定数の集約）

export const siteConfig = {
  name: "デコ文字メーカー",
  description:
    "Instagram・TikTok・Xのプロフィールやネームを盛れる特殊文字・デコ文字を無料で作成。コピペで即使える可愛いフォント23種類以上＆装飾フレーム集。",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://decomoji.example.com",
  ogImage: "/og.png",
  keywords: [
    "デコ文字",
    "特殊文字",
    "コピペ",
    "Instagram プロフ",
    "TikTok 名前",
    "X 表示名",
    "かわいい フォント",
    "盛り文字",
  ],
  author: "deco-moji-maker",
  twitter: "@",
  // Google AdSenseのpub IDを取得後に設定
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
  // Google Analytics 4
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
};

// ランディングページ定義（SNS別キーワード狙い）
export const landingPages = [
  {
    slug: "instagram",
    title: "Instagramプロフィールが映えるデコ文字｜インスタ盛り文字メーカー",
    h1: "Instagram用デコ文字メーカー",
    description:
      "Instagramのプロフィール名・自己紹介で使えるデコ文字をワンタップ生成。コピペで即反映、フォロワーが増える盛れる特殊文字をご用意。",
    intro:
      "インスタのプロフを盛りたい人向け。プロフィール名、自己紹介、ハイライト名、リール説明に使える特殊文字フォントをカテゴリ別にまとめました。",
    tipTitle: "Instagramで使うときのコツ",
    tips: [
      "プロフィール名は1日に何度も変えられないので注意",
      "ユーザー名（@〜）は英数字とアンダースコアのみ。表示名はOK",
      "ハイライトのカバー下の名前にも貼り付け可",
      "PCブラウザではプレビューと実際の表示が違うことあり",
    ],
  },
  {
    slug: "tiktok",
    title: "TikTok表示名のデコ文字｜推し活で映える特殊フォント",
    h1: "TikTok用デコ文字メーカー",
    description:
      "TikTokの表示名・自己紹介で映えるデコ文字を無料生成。可愛い筆記体やまる文字、推し活で使える装飾フレームを集めました。",
    intro:
      "TikTokのプロフィールを盛れる特殊文字フォント。ニックネーム、自己紹介、コメントで使えるかわいい文字をどうぞ。",
    tipTitle: "TikTokで使うときのコツ",
    tips: [
      "一部の特殊文字は環境によって表示されないことあり",
      "ユーザー名と表示名は別。表示名の方が自由度高い",
      "コメント欄でも特殊文字は使えるが端末依存",
      "海外向け配信なら英語フォント系がおすすめ",
    ],
  },
  {
    slug: "x",
    title: "X（旧Twitter）の表示名デコ文字｜映える特殊フォント",
    h1: "X用デコ文字メーカー",
    description:
      "X（旧Twitter）の表示名・bioで使えるデコ文字をワンタップ生成。ポスト本文でも使える特殊フォントを集めました。",
    intro:
      "Xの表示名やbioを盛るための特殊文字フォント。ポストにも使えるかわいい筆記体・記号フレームをどうぞ。",
    tipTitle: "Xで使うときのコツ",
    tips: [
      "ユーザー名（@〜）は英数字のみ。表示名はOK",
      "表示名は50文字まで、bioは160文字まで",
      "ポスト本文でも使えるが検索性は下がるので注意",
      "特殊文字は読み上げソフトで読まれないことがある",
    ],
  },
];
