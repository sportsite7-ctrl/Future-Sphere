import type { MetadataRoute } from "next";
import { stories, categories } from "@/lib/stories";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  // The production domain is intentionally configured at launch, not guessed during the prototype stage.
  if (!siteUrl) return [];

  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/news`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/search`, changeFrequency: "weekly", priority: 0.4 },
    ...categories.map((category) => ({ url: `${siteUrl}/category/${category.slug}`, changeFrequency: "daily" as const, priority: 0.7 })),
    ...stories.map((story) => ({ url: `${siteUrl}/article/${story.slug}`, changeFrequency: "monthly" as const, priority: 0.6 }))
  ];
}
