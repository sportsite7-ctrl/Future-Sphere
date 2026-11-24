import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/news-card";
import { NewsImage } from "@/components/news-image";
import { stories } from "@/lib/stories";
import { getLocale } from "@/lib/locale";
import { t, localizeStory } from "@/lib/i18n";

export function generateStaticParams() { return stories.map((story) => ({ slug: story.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = stories.find((item) => item.slug === slug);
  if (!story) return {};
  const localized = localizeStory(story, await getLocale());
  return { title: localized.title, description: localized.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const original = stories.find((item) => item.slug === slug);
  if (!original) notFound();
  const locale = await getLocale();
  const copy = t(locale);
  const story = localizeStory(original, locale);
  const related = stories.filter((item) => item.slug !== story.slug).slice(0, 2).map((item) => localizeStory(item, locale));
  return (
    <article className="article-page page-shell">
      <div className="article-breadcrumb"><Link href="/">{copy.home}</Link><span>/</span><Link href={`/category/${story.categorySlug}`}>{story.category}</Link><span>/</span><span>{copy.readArticle}</span></div>
      <header className="article-header"><span className="article-category">{story.category} · {copy.demoArticle}</span><h1>{story.title}</h1><p className="article-deck">{story.excerpt}</p>
        <div className="article-byline"><span className="byline-avatar">FS</span><span><b>{copy.editor}</b><small>{story.date} · {story.readTime}</small></span></div>
      </header>
      <NewsImage src={story.image} alt={story.imageAlt} className="article-cover" priority />
      <div className="article-body-wrap"><div className="article-body">
        <div className="article-demo-note">{copy.articleDemo}</div>
        {story.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <div className="article-source-note"><b>{copy.sourceNote}</b><span>{copy.sourceText}</span></div>
        <Link href="/" className="back-link">{copy.backHome}</Link>
      </div></div>
      <section className="related-section"><div className="section-heading"><div><div className="section-kicker">{copy.continueReading}</div><h2>{copy.moreFrom}<span>.</span></h2></div></div><div className="feature-grid">{related.map((item) => <NewsCard key={item.slug} story={item} locale={locale} />)}</div></section>
    </article>
  );
}
