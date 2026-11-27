import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard } from "@/components/news-card";
import { getStories } from "@/lib/content";
import { getLocale } from "@/lib/locale";
import { t, localizeStory } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "en" ? "Search Future Sphere" : "Пошук Future Sphere",
    description: locale === "en" ? "Search AI news, models, tools and research on Future Sphere." : "Пошук новин про ШІ, моделі, інструменти та дослідження на Future Sphere.",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const locale = await getLocale();
  const copy = t(locale);
  const query = q.trim().toLocaleLowerCase(locale === "uk" ? "uk" : "en");
  const localized = (await getStories(locale)).map((story) => localizeStory(story, locale));
  const results = query ? localized.filter((story) => [story.title, story.excerpt, story.category, ...story.body].join(" ").toLocaleLowerCase(locale === "uk" ? "uk" : "en").includes(query)) : [];
  return <section className="listing-page page-shell search-page">
    <div className="article-breadcrumb"><Link href="/">{copy.home}</Link><span>/</span><span>{copy.search}</span></div>
    <div className="listing-heading"><div className="section-kicker">{locale === "en" ? "FIND WHAT MATTERS" : "ЗНАЙТИ СВОЄ"}</div><h1>{copy.search}<span>.</span></h1><p>{copy.searchIntro}</p></div>
    <form className="search-form" action="/search"><input type="search" name="q" defaultValue={q} placeholder={copy.searchPlaceholder} aria-label={copy.search} /><button type="submit">{copy.searchButton} <span>↗</span></button></form>
    <nav className="search-shortcuts" aria-label={locale === "en" ? "Browse topics" : "Популярні теми"}>
      <Link href="/category/ai-models">{locale === "en" ? "AI models" : "Моделі ШІ"}</Link>
      <Link href="/category/tools">{locale === "en" ? "AI tools" : "Інструменти"}</Link>
      <Link href="/category/research">{locale === "en" ? "Research" : "Дослідження"}</Link>
      <Link href="/category/technology">{locale === "en" ? "Technology" : "Технології"}</Link>
    </nav>
    {query && <div className="search-results-label">{copy.searchResults} «{q}» · {results.length}</div>}
    {results.length > 0 ? <div className="listing-grid">{results.map((story) => <NewsCard key={story.slug} story={story} locale={locale} />)}</div> : query ? <div className="empty-state">{copy.noResults} <Link href="/news">{copy.allNews}</Link>.</div> : <div className="search-hint">{copy.searchHint}</div>}
  </section>;
}
