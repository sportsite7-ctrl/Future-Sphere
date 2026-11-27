import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/news-card";
import { getCategories, getStories } from "@/lib/content";
import { getLocale } from "@/lib/locale";
import { t, localizeStory } from "@/lib/i18n";

export async function generateStaticParams() { return []; }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const category = (await getCategories(locale)).find((item) => item.slug === slug);
  if (!category) return { robots: { index: false, follow: true } };
  return {
    title: locale === "en" ? category.name + " — AI News & Insights" : category.name + " — новини та огляди",
    description: category.description,
    alternates: { canonical: "/category/" + slug },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const copy = t(locale);
  const [categories, stories] = await Promise.all([getCategories(locale), getStories(locale)]);
  const base = categories.find((item) => item.slug === slug);
  if (!base) notFound();
  const category = { name: base.name, description: base.description };
  const filtered = stories.filter((story) => story.categorySlug === slug).map((story) => localizeStory(story, locale));
  return <section className="listing-page page-shell">
    <div className="article-breadcrumb"><Link href="/">{copy.home}</Link><span>/</span><span>{category.name}</span></div>
    <div className="listing-heading"><div className="section-kicker">{copy.categoryKicker}</div><h1>{category.name}<span>.</span></h1><p>{category.description}</p></div>
    <div className="listing-grid">{filtered.map((story) => <NewsCard key={story.slug} story={story} locale={locale} />)}</div>
    {filtered.length === 0 && <p className="empty-state">{copy.emptyCategory}</p>}
  </section>;
}
