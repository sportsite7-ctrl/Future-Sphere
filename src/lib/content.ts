import { categories as demoCategories, stories as demoStories, type Story } from "@/lib/stories";
import type { Locale } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

export type ContentCategory = {
  slug: string;
  name: string;
  description: string;
};

const fallbackImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1500&q=85";

const editorialImages = {
  openai: { url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1500&q=85", alt: "AI software and ChatGPT-style digital workspace" },
  google: { url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1500&q=85", alt: "Scientific visualization representing AI research" },
  anthropic: { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1500&q=85", alt: "Robotics and intelligent technology" },
  huggingface: { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1500&q=85", alt: "Computer chips and AI hardware" },
  tools: { url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1500&q=85", alt: "Laptop workstation representing digital tools" },
  research: { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1500&q=85", alt: "Global technology and scientific research" },
  industry: { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1500&q=85", alt: "Modern technology industry and infrastructure" },
  robotics: { url: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=1500&q=85", alt: "Robotics and automation technology" },
  data: { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1500&q=85", alt: "Data center infrastructure" },
  coding: { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1500&q=85", alt: "Technology hardware and circuit board" },
};

const genericImageIds = ["photo-1677442136019-21780ecad995"];

function stableChoice<T>(items: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return items[Math.abs(hash) % items.length];
}

function fallbackForArticle(sourceUrl: string | null, title: string, categorySlug: string) {
  const text = `${sourceUrl || ""} ${title}`.toLowerCase();
  if (/openai|chatgpt/.test(text)) return editorialImages.openai;
  if (/google|gemini|deepmind/.test(text)) return editorialImages.google;
  if (/anthropic|claude/.test(text)) return editorialImages.anthropic;
  if (/huggingface|hugging face/.test(text)) return editorialImages.huggingface;
  if (/robot|robotics|automation/.test(text)) return editorialImages.robotics;
  if (/chip|gpu|processor|hardware|semiconductor/.test(text)) return editorialImages.coding;
  if (/data cent(?:er|re)|cloud infrastructure|server/.test(text)) return editorialImages.data;
  if (/code|coding|developer|programming|software/.test(text)) return editorialImages.tools;
  if (categorySlug === "tools") return editorialImages.tools;
  if (categorySlug === "research") return editorialImages.research;
  if (categorySlug === "industry") return editorialImages.industry;
  if (categorySlug === "technology") return stableChoice([editorialImages.research, editorialImages.industry, editorialImages.data, editorialImages.robotics], text);
  return stableChoice([editorialImages.research, editorialImages.robotics, editorialImages.data, editorialImages.coding], text);
}

function isGenericPlaceholder(url: string | null | undefined) {
  return Boolean(url && genericImageIds.some((id) => url.includes(id)));
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
      .select("id,category_id,source_url,status,is_featured,published_at,image_url,image_alt,image_credit")
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
        // Older imported rows may already contain the original one-image placeholder.
        // Treat it like a missing image so each story receives its own topic/company visual.
        const editorialImage = article.image_url && !isGenericPlaceholder(article.image_url)
          ? { url: article.image_url, alt: article.image_alt || translation.title }
          : fallbackForArticle(article.source_url, translation.title, categorySlug);
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
          image: editorialImage.url,
          imageAlt: editorialImage.alt,
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
