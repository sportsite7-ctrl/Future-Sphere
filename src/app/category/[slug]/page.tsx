import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/news-card";
import { categories, stories } from "@/lib/stories";

export function generateStaticParams() { return categories.map((item) => ({ slug: item.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  return category ? { title: category.name, description: category.description } : {};
}
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const filtered = stories.filter((story) => story.categorySlug === slug);
  return <section className="listing-page page-shell">
    <div className="article-breadcrumb"><Link href="/">Головна</Link><span>/</span><span>{category.name}</span></div>
    <div className="listing-heading"><div className="section-kicker">РУБРИКА FUTURE SPHERE</div><h1>{category.name}<span>.</span></h1><p>{category.description}</p></div>
    <div className="listing-grid">{filtered.map((story) => <NewsCard key={story.slug} story={story} />)}</div>
    {filtered.length === 0 && <p className="empty-state">У цій рубриці поки немає матеріалів.</p>}
  </section>;
}
