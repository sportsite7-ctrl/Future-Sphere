import { categories as demoCategories, stories as demoStories, type Story } from "@/lib/stories";
import type { Locale } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

export type ContentCategory = {
  slug: string;
  name: string;
  description: string;
};

type EditorialImage = { url: string; alt: string };

// A small, curated set of six dependable editorial themes.
// Each image is selected from the article's source, title and category.
const editorialImageSets: Record<string, EditorialImage[]> = {
  ai: [
    { url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1500&q=85", alt: "Abstract artificial intelligence visualization" },
    { url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1500&q=85", alt: "Scientific visualization representing AI research" },
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1500&q=85", alt: "Computing hardware used in artificial intelligence" },
  ],
  gemini: [
    { url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1500&q=85", alt: "Scientific visualization representing AI research" },
    { url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1500&q=85", alt: "Abstract artificial intelligence visualization" },
  ],
  robotics: [
    { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1500&q=85", alt: "Modern robot representing robotics and automation" },
  ],
  chips: [
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1500&q=85", alt: "Computer chip and electronic circuit board" },
  ],
  tools: [
    { url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1500&q=85", alt: "Software development workstation representing AI tools" },
    { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1500&q=85", alt: "Digital work and software tools" },
  ],
  infrastructure: [
    { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1500&q=85", alt: "Data center server racks representing AI infrastructure" },
  ],
};

function pickEditorialImage(key: string, title: string): EditorialImage {
  const pool = editorialImageSets[key] ?? editorialImageSets.ai;
  // Stable title hash gives different stories within a theme different visuals,
  // while keeping the same story's image consistent across page views.
  let hash = 0;
  for (const character of title.toLowerCase()) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return pool[hash % pool.length];
}

function fallbackForArticle(sourceUrl: string | null, title: string, categorySlug: string): EditorialImage {
  const source = (sourceUrl || "").toLowerCase();
  const headline = title.toLowerCase();

  // Match the subject, not merely the publisher. OpenAI and Google publish
  // stories across many subjects, so their names alone must not select a robot.
  if (/robotics|humanoid|robot\b|робототех|гуманоїд|робот\b|автоматизац/.test(headline)) return pickEditorialImage("robotics", title);
  if (/gpu|chipset|semiconductor|processor|hardware|microchip|чип|процесор|напівпровідник|відеокарт|графічн.*процесор/.test(headline)) return pickEditorialImage("chips", title);
  if (/data cent(?:er|re)|datacenter|server farm|cloud infrastructure|дата.?центр|серверн.*інфраструктур|хмарн.*інфраструктур/.test(headline)) return pickEditorialImage("infrastructure", title);
  if (/api|developer|coding|programming|code assistant|software|app launch|product launch|agent platform|інструмент|застосунок|програм|код|розробник|агент|для команд/.test(headline)) return pickEditorialImage("tools", title);

  if (/google|gemini|deepmind/.test(headline)) return pickEditorialImage("gemini", title);
  if (/openai|chatgpt|sora|gpt[- ]?[0-9]|anthropic|claude|\bsonnet\b|\bopus\b|hugging.?face/.test(headline)) return pickEditorialImage("ai", title);

  // Publisher and broad category are last-resort hints only.
  if (/huggingface|hf\.co/.test(source) && categorySlug === "tools") return pickEditorialImage("tools", title);
  if (/google|deepmind/.test(source) && categorySlug === "research") return pickEditorialImage("gemini", title);
  if (categorySlug === "tools") return pickEditorialImage("tools", title);
  if (categorySlug === "industry") return pickEditorialImage("infrastructure", title);
  if (categorySlug === "technology") return pickEditorialImage("infrastructure", title);
  if (categorySlug === "research") return pickEditorialImage("gemini", title);
  return pickEditorialImage("ai", title);
}

export async function getCategories(locale: Locale): Promise<ContentCategory[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("slug,name_uk,name_en,description_uk,description_en,sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    if (data?.length) {
      return data.map((item) => ({
        slug: item.slug,
        name: locale === "en" ? item.name_en : item.name_uk,
        description: locale === "en" ? item.description_en : item.description_uk,
      }));
    }
  } catch (error) {
    console.error("Future Sphere categories query failed:", error);
  }
  return demoCategories.map((item) => ({
    slug: item.slug,
    name: locale === "en" ? ({
      "ai-models": "AI & Models", tools: "Tools", research: "Research",
      technology: "Technology", industry: "Industry"
    }[item.slug] ?? item.name) : item.name,
    description: item.description,
  }));
}

export async function getStories(locale: Locale): Promise<Story[]> {
  try {
    const { data: articles, error: articlesError } = await supabase
      .from("articles")
      .select("id,category_id,source_url,status,is_featured,published_at,image_url,image_alt,image_credit,image_source_url")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (articlesError) throw articlesError;
    if (articles?.length) {
      const ids = articles.map((article) => article.id);
      const [{ data: translations, error: translationsError }, { data: categoriesData, error: categoriesError }] = await Promise.all([
        supabase.from("article_translations")
          .select("article_id,lang,slug,title,excerpt,body,seo_title,seo_description")
          .in("article_id", ids),
        supabase.from("categories")
          .select("id,slug,name_uk,name_en")
      ]);
      if (translationsError) throw translationsError;
      if (categoriesError) throw categoriesError;

      const translationRows = translations ?? [];
      const categoryRows = categoriesData ?? [];
      const categoryById = new Map(categoryRows.map((category) => [category.id, category]));
      const result: Story[] = [];

      for (const article of articles) {
        const candidates = translationRows.filter((item) => item.article_id === article.id);
        const translation = candidates.find((item) => item.lang === locale);
        if (!translation?.slug || !translation.title) continue;

        const category = categoryById.get(article.category_id);
        const categorySlug = category?.slug ?? "technology";
        const categoryName = category
          ? (locale === "en" ? category.name_en : category.name_uk)
          : (locale === "en" ? "Technology" : "Технології");
        const bodyText = typeof translation.body === "string" ? translation.body : "";
        const paragraphs = bodyText.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
        const wordCount = bodyText.trim() ? bodyText.trim().split(/\s+/).length : 0;
        const date = article.published_at
          ? new Intl.DateTimeFormat(locale === "en" ? "en-US" : "uk-UA", {
              day: "numeric", month: "long", year: "numeric"
            }).format(new Date(article.published_at))
          : "";
        // Only trust RSS images carrying the explicit provenance marker written
        // by the current importer. Older rows used the source article URL alone,
        // which could incorrectly bless a generic placeholder as a real image.
        const hasVerifiedRssImage = Boolean(
          article.image_url &&
          article.image_source_url === `rss-image:${article.source_url}`
        );
        const editorialImage = fallbackForArticle(article.source_url, translation.title, categorySlug);
        const displayImage = hasVerifiedRssImage ? article.image_url as string : editorialImage.url;
        const displayAlt = hasVerifiedRssImage && article.image_alt ? article.image_alt : editorialImage.alt;
        result.push({
          slug: translation.slug,
          category: categoryName,
          categorySlug,
          title: translation.title,
          excerpt: translation.excerpt ?? "",
          date,
          publishedAt: article.published_at ?? undefined,
          readTime: locale === "en"
            ? `${Math.max(1, Math.ceil(wordCount / 200))} min read`
            : `${Math.max(1, Math.ceil(wordCount / 200))} хв читання`,
          image: displayImage,
          imageAlt: displayAlt,
          body: paragraphs.length ? paragraphs : (bodyText ? [bodyText] : []),
          isDemo: false,
          sourceUrl: article.source_url ?? undefined,
          imageCredit: article.image_credit ?? undefined,
          seoTitle: translation.seo_title ?? undefined,
          seoDescription: translation.seo_description ?? undefined,
          isFeatured: article.is_featured ?? false,
        } as Story);
      }
      if (result.length) return result;
    }
  } catch (error) {
    console.error("Future Sphere articles query failed; using demo content:", error);
  }
  return demoStories.map((story) => ({ ...story, isDemo: true }));
}
