import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/news-card";
import { categories, stories } from "@/lib/stories";
import { getLocale } from "@/lib/locale";
import { categoryText, t, localizeStory } from "@/lib/i18n";

export async function generateStaticParams() { return categories.map((item) => ({ slug: item.slug })); }

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const base = categories.find((item) => item.slug === slug);
  if (!base) notFound();
  const locale = await getLocale();
  const copy = t(locale);
  const category = categoryText(slug, locale, base);
  const filtered = stories.filter((story) => story.categorySlug === slug).map((story) => localizeStory(story, locale));
  return <section className="listing-page page-shell">
    <div className="article-breadcrumb"><Link href="/">{copy.home}</Link><span>/</span><span>{category.name}</span></div>
    <div className="listing-heading"><div className="section-kicker">{copy.categoryKicker}</div><h1>{category.name}<span>.</span></h1><p>{category.description}</p></div>
    <div className="listing-grid">{filtered.map((story) => <NewsCard key={story.slug} story={story} locale={locale} />)}</div>
    {filtered.length === 0 && <p className="empty-state">{copy.emptyCategory}</p>}
  </section>;
}
