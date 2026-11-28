import type { MetadataRoute } from "next";
import { getCategories, getStories } from "@/lib/content";

const siteUrl = "https://future-sphere-henna.vercel.app";
const localized = (locale: "uk" | "en", path: string) => `${siteUrl}/${locale}${path === "/" ? "" : path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [ukCategories, enCategories, ukStories, enStories] = await Promise.all([
    getCategories("uk"), getCategories("en"), getStories("uk"), getStories("en")
  ]);
  const pages: MetadataRoute.Sitemap = [];
  for (const path of ["/", "/news", "/about"]) {
    pages.push({
      url: localized("uk", path),
      changeFrequency: path === "/" || path === "/news" ? "daily" : "weekly",
      priority: path === "/" ? 1 : path === "/news" ? 0.9 : 0.6,
      alternates: { languages: { "uk-UA": localized("uk", path), "en-US": localized("en", path) } }
    });
    pages.push({
      url: localized("en", path),
      changeFrequency: path === "/" || path === "/news" ? "daily" : "weekly",
      priority: path === "/" ? 1 : path === "/news" ? 0.9 : 0.6,
      alternates: { languages: { "uk-UA": localized("uk", path), "en-US": localized("en", path) } }
    });
  }

  const enCategorySlugs = new Set(enCategories.map((item) => item.slug));
  for (const category of ukCategories) {
    if (!enCategorySlugs.has(category.slug)) continue;
    const path = `/category/${category.slug}`;
    pages.push({
      url: localized("uk", path), changeFrequency: "daily", priority: 0.7,
      alternates: { languages: { "uk-UA": localized("uk", path), "en-US": localized("en", path) } }
    });
    pages.push({
      url: localized("en", path), changeFrequency: "daily", priority: 0.7,
      alternates: { languages: { "uk-UA": localized("uk", path), "en-US": localized("en", path) } }
    });
  }

  for (const story of ukStories.filter((item) => !item.isDemo)) {
    pages.push({
      url: localized("uk", `/article/${story.slug}`),
      lastModified: story.publishedAt ? new Date(story.publishedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.6
    });
  }
  for (const story of enStories.filter((item) => !item.isDemo)) {
    pages.push({
      url: localized("en", `/article/${story.slug}`),
      lastModified: story.publishedAt ? new Date(story.publishedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.6
    });
  }
  return pages;
}
