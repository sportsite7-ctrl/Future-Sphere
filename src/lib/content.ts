import { categories as demoCategories, stories as demoStories, type Story } from "@/lib/stories";
import type { Locale } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

export type ContentCategory = {
  slug: string;
  name: string;
  description: string;
};

const fallbackImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1500&q=85";

type EditorialImage = { url: string; alt: string };

const editorialImageSets: Record<string, EditorialImage[]> = {
  openai: [
    { url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1500&q=85", alt: "Abstract artificial intelligence concept" },
    { url: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=1500&q=85", alt: "Robotics and intelligent automation" },
    { url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1500&q=85", alt: "Digital neural network visualization" },
    { url: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1500&q=85", alt: "Artificial intelligence technology concept" },
  ],
  google: [
    { url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1500&q=85", alt: "Scientific visualization and AI research" },
    { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1500&q=85", alt: "Global technology network" },
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1500&q=85", alt: "Advanced computing hardware" },
  ],
  anthropic: [
    { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1500&q=85", alt: "Intelligent robotics technology" },
    { url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1500&q=85", alt: "Artificial intelligence neural network" },
    { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1500&q=85", alt: "Computing infrastructure" },
  ],
  huggingface: [
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1500&q=85", alt: "Computer hardware and circuit board" },
    { url: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1500&q=85", alt: "Artificial intelligence technology" },
    { url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1500&q=85", alt: "Software development workstation" },
  ],
  tools: [
    { url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1500&q=85", alt: "Software tools workstation" },
    { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1500&q=85", alt: "Digital collaboration and technology" },
    { url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1500&q=85", alt: "Technology team workspace" },
  ],
  research: [
    { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1500&q=85", alt: "Global scientific technology network" },
    { url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1500&q=85", alt: "Scientific research visualization" },
    { url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1500&q=85", alt: "Scientific laboratory research" },
  ],
  industry: [
    { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1500&q=85", alt: "Modern technology industry" },
    { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1500&q=85", alt: "Cloud and data center infrastructure" },
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1500&q=85", alt: "Semiconductor and computing hardware" },
  ],
  robotics: [
    { url: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=1500&q=85", alt: "Robotics and automation" },
    { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1500&q=85", alt: "Robot technology" },
  ],
  data: [
    { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1500&q=85", alt: "Data center servers" },
    { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1500&q=85", alt: "Cloud computing network" },
  ],
  coding: [
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1500&q=85", alt: "Computer chips and circuitry" },
    { url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1500&q=85", alt: "Software engineering workspace" },
  ],
};

const genericImageIds = ["photo-1677442136019-21780ecad995"];

function stableChoice<T>(items: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return items[Math.abs(hash) % items.length];
}

function fallbackForArticle(sourceUrl: string | null, title: string, categorySlug: string) {
  const text = `${sourceUrl || ""} ${title}`.toLowerCase();
  const choose = (key: string) => stableChoice(editorialImageSets[key], text);
  if (/openai|chatgpt/.test(text)) return choose("openai");
  if (/google|gemini|deepmind/.test(text)) return choose("google");
  if (/anthropic|claude/.test(text)) return choose("anthropic");
  if (/huggingface|hugging face/.test(text)) return choose("huggingface");
  if (/robot|robotics|automation/.test(text)) return choose("robotics");
  if (/chip|gpu|processor|hardware|semiconductor/.test(text)) return choose("coding");
  if (/data cent(?:er|re)|cloud infrastructure|server/.test(text)) return choose("data");
  if (/code|coding|developer|programming|software/.test(text)) return choose("tools");
  if (categorySlug === "tools") return choose("tools");
  if (categorySlug === "research") return choose("research");
  if (categorySlug === "industry") return choose("industry");
  if (categorySlug === "technology") return stableChoice([...editorialImageSets.research, ...editorialImageSets.industry, ...editorialImageSets.data, ...editorialImageSets.robotics], text);
  return stableChoice([...editorialImageSets.research, ...editorialImageSets.robotics, ...editorialImageSets.data, ...editorialImageSets.coding], text);
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
