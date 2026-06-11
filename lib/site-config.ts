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
