// ブログ記事のメタデータ管理
// 記事を追加するときはこのリストに追加する

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO 8601
  category: string;
  emoji: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "instagram-deco-moji-patterns",
    title: "Instagramプロフィールで人気のデコ文字パターン15選",
    description:
      "Instagramのプロフィール名・自己紹介で実際に使われている、フォロワーが増えやすい人気のデコ文字パターンを15個まとめました。",
    publishedAt: "2026-05-16",
    category: "Instagram",
    emoji: "📸",
  },
  {
    slug: "tiktok-special-fonts-guide",
    title: "TikTokで映える特殊文字の使い方完全ガイド",
    description:
      "TikTokの表示名・bio・コメントで映える特殊文字の選び方と使い方を、実例とともに完全ガイド。",
    publishedAt: "2026-05-16",
    category: "TikTok",
    emoji: "🎵",
  },
  {
    slug: "unicode-history-explained",
    title: "特殊文字とUnicodeの違い・歴史をわかりやすく解説",
    description:
      "なぜ筆記体やまる文字がコピー＆ペーストで使えるのか？特殊文字とUnicodeの仕組みを、初心者にもわかりやすく解説します。",
    publishedAt: "2026-05-16",
    category: "解説",
    emoji: "📚",
  },
  {
    slug: "machine-dependent-characters",
    title: "機種依存文字とは？iPhoneとAndroidの違いも解説",
    description:
      "iPhoneとAndroidで表示が違ってしまう「機種依存文字」の仕組みと、どんな文字が表示されにくいのかを解説します。",
    publishedAt: "2026-05-16",
    category: "解説",
    emoji: "📱",
  },
  {
    slug: "oshikatsu-decomoji-templates",
    title: "推し活で使えるデコ文字テンプレート集",
    description:
      "推し活アカウントのプロフィール、自己紹介、ファンレターで使える、推しへの愛が伝わるデコ文字テンプレートを集めました。",
    publishedAt: "2026-05-16",
    category: "推し活",
    emoji: "💖",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
