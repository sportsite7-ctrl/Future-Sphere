import type { MetadataRoute } from "next";
import { stories, categories } from "@/lib/stories";

const siteUrl = "https://future-sphere.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/news`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/search`, changeFrequency: "weekly", priority: 0.4 },
    ...categories.map((category) => ({ url: `${siteUrl}/category/${category.slug}`, changeFrequency: "daily" as const, priority: 0.7 })),
    ...stories.map((story) => ({ url: `${siteUrl}/article/${story.slug}`, changeFrequency: "monthly" as const, priority: 0.6 }))
  ];
}
