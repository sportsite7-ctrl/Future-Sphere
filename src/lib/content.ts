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
const editorialImageSets: Record<string, EditorialImage> = {
  ai: {
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1500&q=85",
    alt: "Abstract artificial intelligence and neural network visualization",
  },
  gemini: {
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1500&q=85",
    alt: "Scientific visualization representing Google's Gemini and AI research",
  },
  robotics: {
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1500&q=85",
    alt: "Modern humanoid robot representing robotics and automation",
  },
  chips: {
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1500&q=85",
    alt: "Computer chip and electronic circuit board",
  },
  tools: {
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1500&q=85",
    alt: "Software development workstation representing AI tools",
  },
  infrastructure: {
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1500&q=85",
    alt: "Data center server racks representing AI infrastructure",
  },
};

function fallbackForArticle(sourceUrl: string | null, title: string, categorySlug: string): EditorialImage {
  const source = (sourceUrl || "").toLowerCase();
  const headline = title.toLowerCase();
  const text = `${headline} ${source}`;

  // Classify the actual subject of the article before looking at its publisher.
  // This is important because one RSS publisher (e.g. OpenAI) publishes many
  // different kinds of stories: models, apps, coding, hardware and research.
  if (/robotics|humanoid|robot\b|робототех|гуманоїд|робот\b|автоматизац/.test(headline)) return editorialImageSets.robotics;
  if (/gpu|chipset|semiconductor|processor|hardware|microchip|чип|процесор|напівпровідник|відеокарт|графічн.*процесор/.test(headline)) return editorialImageSets.chips;
  if (/data cent(?:er|re)|datacenter|server farm|cloud infrastructure|дата.?центр|серверн.*інфраструктур|хмарн.*інфраструктур/.test(headline)) return editorialImageSets.infrastructure;
  if (/api|developer|coding|programming|code assistant|software|app launch|product launch|agent platform|інструмент|застосунок|програм|код|розробник|агент/.test(headline)) return editorialImageSets.tools;

  // Company-specific editorial visuals are selected only when the headline
  // actually concerns that company's model/product, not merely its RSS domain.
  if (/google|gemini|deepmind/.test(headline)) return editorialImageSets.gemini;
  if (/openai|chatgpt|sora|gpt[- ]?[0-9]/.test(headline)) return editorialImageSets.ai;
  if (/anthropic|claude|\bsonnet\b|\bopus\b/.test(headline)) return editorialImageSets.ai;
  if (/hugging.?face/.test(headline)) return editorialImageSets.ai;

  // A publisher URL is a weak signal, used only after the headline.
  if (/huggingface|hf\.co/.test(source) && categorySlug === "tools") return editorialImageSets.tools;
  if (/google|deepmind/.test(source)) return editorialImageSets.gemini;
  if (/openai|anthropic/.test(source)) return editorialImageSets.ai;

  if (categorySlug === "tools") return editorialImageSets.tools;
  if (categorySlug === "industry") return editorialImageSets.infrastructure;
  if (categorySlug === "research") return editorialImageSets.ai;
  if (categorySlug === "technology") return editorialImageSets.infrastructure;
  return editorialImageSets.ai;
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
        const translation = candidates.find((item) => item.lang === locale)
          ?? candidates.find((item) => item.lang === (locale === "uk" ? "en" : "uk"));
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
        // Use the curated editorial image mapping consistently.
        // The database contains legacy fallback URLs that were incorrectly
        // marked as article-source images, so image_source_url is NOT reliable
        // provenance for existing rows. Ignore stored thumbnails until a
        // dedicated, verified RSS-image provenance field is introduced.
        const editorialImage = fallbackForArticle(article.source_url, translation.title, categorySlug);
        const displayImage = editorialImage.url;
        const displayAlt = editorialImage.alt;
        result.push({
          slug: translation.slug,
          category: categoryName,
          categorySlug,
          title: translation.title,
          excerpt: translation.excerpt ?? "",
          date,
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
