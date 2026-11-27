import type { MetadataRoute } from "next";
import { getCategories, getStories } from "@/lib/content";

const siteUrl = "https://future-sphere-henna.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, stories] = await Promise.all([
    getCategories("uk"),
    getStories("uk"),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/news`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/category/${category.slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = stories
    .filter((story) => !story.isDemo)
    .map((story) => ({
      url: `${siteUrl}/article/${story.slug}`,
      lastModified: story.publishedAt ? new Date(story.publishedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  return [...staticPages, ...categoryPages, ...articlePages];
}
