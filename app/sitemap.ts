import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const lastModified = new Date();

  return [
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
      url: `${base}/howto`,
      lastModified,
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: `${base}/privacy`,
      lastModified,
      priority: 0.3,
      changeFrequency: "yearly",
    },
  ];
}
