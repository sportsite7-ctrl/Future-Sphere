import Link from "next/link";
import { NewsCard } from "@/components/news-card";
import { stories } from "@/lib/stories";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLocaleLowerCase("uk");
  const results = query ? stories.filter((story) => [story.title, story.excerpt, story.category, ...story.body].join(" ").toLocaleLowerCase("uk").includes(query)) : [];
  return <section className="listing-page page-shell search-page">
    <div className="article-breadcrumb"><Link href="/">Головна</Link><span>/</span><span>Пошук</span></div>
    <div className="listing-heading"><div className="section-kicker">ЗНАЙТИ СВОЄ</div><h1>Пошук<span>.</span></h1><p>Знайдіть матеріали про моделі, інструменти та дослідження штучного інтелекту.</p></div>
    <form className="search-form" action="/search"><input type="search" name="q" defaultValue={q} placeholder="Наприклад, AI-моделі або дослідження..." aria-label="Пошуковий запит" /><button type="submit">Шукати <span>↗</span></button></form>
    {query && <div className="search-results-label">Результати для «{q}» · {results.length}</div>}
    {results.length > 0 ? <div className="listing-grid">{results.map((story) => <NewsCard key={story.slug} story={story} />)}</div> : query ? <div className="empty-state">Нічого не знайдено. Спробуйте інший запит або перегляньте <Link href="/news">усі матеріали</Link>.</div> : <div className="search-hint">Почніть із назви теми або ключового слова.</div>}
  </section>;
}
