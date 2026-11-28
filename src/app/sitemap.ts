import type { MetadataRoute } from "next";
import { getCategories, getStories } from "@/lib/content";
import type { Story } from "@/lib/stories";

const siteUrl = "https://future-sphere-henna.vercel.app";
const localized = (locale: "uk" | "en", path: string) => `${siteUrl}/${locale}${path === "/" ? "" : path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [ukCategories, enCategories, ukStories, enStories] = await Promise.all([
    getCategories("uk"), getCategories("en"), getStories("uk"), getStories("en")
  ]);
  const liveUk = ukStories.filter((story) => !story.isDemo);
  const liveEn = enStories.filter((story) => !story.isDemo);
  const pages: MetadataRoute.Sitemap = [];

  // About is fully localized and contains stable editorial information.
  for (const locale of ["uk", "en"] as const) {
    pages.push({
      url: localized(locale, "/about"),
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: { languages: { "uk-UA": localized("uk", "/about"), "en-US": localized("en", "/about") } }
    });
  }

  for (const locale of ["uk", "en"] as const) {
    const stories = locale === "uk" ? liveUk : liveEn;
    if (!stories.length) continue;
    for (const path of ["/", "/news"]) {
      pages.push({
        url: localized(locale, path),
        changeFrequency: "daily",
        priority: path === "/" ? 1 : 0.9,
        alternates: { languages: {
          ...(liveUk.length ? { "uk-UA": localized("uk", path) } : {}),
          ...(liveEn.length ? { "en-US": localized("en", path) } : {})
        } }
      });
    }
  }

  const enCategorySlugs = new Set(enCategories.map((item) => item.slug));
  const ukCategorySlugs = new Set(ukCategories.map((item) => item.slug));
  for (const category of ukCategories) {
    const path = `/category/${category.slug}`;
    const hasUk = ukCategorySlugs.has(category.slug) && liveUk.some((story) => story.categorySlug === category.slug);
    const hasEn = enCategorySlugs.has(category.slug) && liveEn.some((story) => story.categorySlug === category.slug);
    if (hasUk) pages.push({
      url: localized("uk", path), changeFrequency: "daily", priority: 0.7,
      alternates: { languages: {
        ...(hasUk ? { "uk-UA": localized("uk", path) } : {}),
        ...(hasEn ? { "en-US": localized("en", path) } : {})
      } }
    });
    if (hasEn) pages.push({
      url: localized("en", path), changeFrequency: "daily", priority: 0.7,
      alternates: { languages: {
        ...(hasUk ? { "uk-UA": localized("uk", path) } : {}),
        ...(hasEn ? { "en-US": localized("en", path) } : {})
      } }
    });
  }

  const enByTranslation = new Map<string, Story>();
  for (const story of liveEn) if (story.translationId) enByTranslation.set(story.translationId, story);
  const ukByTranslation = new Map<string, Story>();
  for (const story of liveUk) if (story.translationId) ukByTranslation.set(story.translationId, story);

  for (const story of liveUk) {
    const counterpart = story.translationId ? enByTranslation.get(story.translationId) : undefined;
    pages.push({
      url: localized("uk", `/article/${story.slug}`),
      lastModified: story.publishedAt ? new Date(story.publishedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.6,
      ...(counterpart ? { alternates: { languages: {
        "uk-UA": localized("uk", `/article/${story.slug}`),
        "en-US": localized("en", `/article/${counterpart.slug}`)
      } } } : {})
    });
  }
  for (const story of liveEn) {
    const counterpart = story.translationId ? ukByTranslation.get(story.translationId) : undefined;
    pages.push({
      url: localized("en", `/article/${story.slug}`),
      lastModified: story.publishedAt ? new Date(story.publishedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.6,
      ...(counterpart ? { alternates: { languages: {
        "uk-UA": localized("uk", `/article/${counterpart.slug}`),
        "en-US": localized("en", `/article/${story.slug}`)
      } } } : {})
    });
  }
  return pages;
}
