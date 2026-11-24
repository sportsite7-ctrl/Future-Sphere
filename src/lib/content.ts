import { categories as demoCategories, stories as demoStories, type Story } from "@/lib/stories";
import type { Locale } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

export type ContentCategory = {
  slug: string;
  name: string;
  description: string;
};

const fallbackImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1500&q=85";

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
          image: article.image_url || fallbackImage,
          imageAlt: article.image_alt || translation.title,
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
