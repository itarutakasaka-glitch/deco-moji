import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { blogPosts } from "@/lib/blog-posts";
import { COPY_CATEGORIES } from "@/lib/copy-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const lastModified = new Date();

  // 固定ページ
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified, priority: 1.0, changeFrequency: "weekly" },
    {
      url: `${base}/instagram`,
      lastModified,
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      url: `${base}/tiktok`,
      lastModified,
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      url: `${base}/x`,
      lastModified,
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      url: `${base}/shindan`,
      lastModified,
      priority: 0.9,
      changeFrequency: "monthly",
    },
    {
      url: `${base}/kabegami`,
      lastModified,
      priority: 0.9,
      changeFrequency: "monthly",
    },
    {
      url: `${base}/blog`,
      lastModified,
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      url: `${base}/mojibake`,
      lastModified,
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      url: `${base}/howto`,
      lastModified,
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: `${base}/about`,
      lastModified,
      priority: 0.5,
      changeFrequency: "monthly",
    },
    {
      url: `${base}/contact`,
      lastModified,
      priority: 0.5,
      changeFrequency: "monthly",
    },
    {
      url: `${base}/privacy`,
      lastModified,
      priority: 0.3,
      changeFrequency: "yearly",
    },
  ];

  // コピペ素材集
  const copyPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/copy`,
      lastModified,
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    ...COPY_CATEGORIES.map((c) => ({
      url: `${base}/copy/${c.slug}`,
      lastModified,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
  ];

  // ブログ記事
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...copyPages, ...blogPages];
}
