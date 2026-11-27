import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/news-card";
import { NewsImage } from "@/components/news-image";
import { getStories } from "@/lib/content";
import { getLocale } from "@/lib/locale";
import { t, localizeStory } from "@/lib/i18n";

export async function generateStaticParams() { return []; }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const story = (await getStories(locale)).find((item) => item.slug === slug);
  if (!story) return {};
  const localized = localizeStory(story, locale);
  const title = localized.seoTitle || localized.title;
  const description = localized.seoDescription || localized.excerpt;
  const canonical = `https://future-sphere-henna.vercel.app/article/${slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      images: localized.image ? [{ url: localized.image, alt: localized.imageAlt }] : [],
      publishedTime: localized.publishedAt,
      siteName: "Future Sphere",
      locale: locale === "uk" ? "uk_UA" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: localized.image ? [localized.image] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const copy = t(locale);
  const stories = await getStories(locale);
  const original = stories.find((item) => item.slug === slug);
  if (!original) notFound();
  const story = localizeStory(original, locale);
  const related = stories.filter((item) => item.slug !== story.slug).slice(0, 2).map((item) => localizeStory(item, locale));
  const canonical = `https://future-sphere-henna.vercel.app/article/${slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: story.seoTitle || story.title,
    description: story.seoDescription || story.excerpt,
    image: [story.image],
    datePublished: story.publishedAt,
    dateModified: story.publishedAt,
    inLanguage: locale === "uk" ? "uk-UA" : "en",
    mainEntityOfPage: canonical,
    author: { "@type": "Organization", name: "Future Sphere Editorial Team" },
    publisher: { "@type": "Organization", name: "Future Sphere" },
    ...(story.sourceUrl ? { isBasedOn: story.sourceUrl } : {}),
  };
  return (
    <article className="article-page page-shell">
      {!story.isDemo && <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />}
      <div className="article-breadcrumb"><Link href="/">{copy.home}</Link><span>/</span><Link href={`/category/${story.categorySlug}`}>{story.category}</Link><span>/</span><span>{copy.readArticle}</span></div>
      <header className="article-header"><span className="article-category">{story.category}{story.isDemo ? ` · ${copy.demoArticle}` : ""}</span><h1>{story.title}</h1><p className="article-deck">{story.excerpt}</p>
        <div className="article-byline"><span className="byline-avatar">FS</span><span><b>{copy.editor}</b><small>{story.date} · {story.readTime}</small></span></div>
      </header>
      <NewsImage src={story.image} alt={story.imageAlt} className="article-cover" priority />
      <div className="article-layout"><div className="article-body-wrap"><div className="article-body">
        {story.isDemo && <div className="article-demo-note">{copy.articleDemo}</div>}
        {story.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        {story.sourceUrl ? <div className="article-source-note"><b>{copy.sourceNote}</b><a href={story.sourceUrl} target="_blank" rel="noreferrer">{locale === "en" ? "Open original source" : "Відкрити першоджерело"} ↗</a>{story.imageCredit && <span>{story.imageCredit}</span>}</div> : <div className="article-source-note"><b>{copy.sourceNote}</b><span>{copy.sourceText}</span></div>}
        <Link href="/" className="back-link">{copy.backHome}</Link>
      </div></div>
      <aside className="article-sidebar">
        <div className="article-sidebar-card">
          <div className="section-kicker">{locale === "en" ? "ARTICLE DETAILS" : "ПРО МАТЕРІАЛ"}</div>
          <h3>{locale === "en" ? "At a glance" : "Коротко про матеріал"}</h3>
          <div className="article-sidebar-row"><span>{locale === "en" ? "Topic" : "Тема"}</span><b>{story.category}</b></div>
          <div className="article-sidebar-row"><span>{locale === "en" ? "Published" : "Опубліковано"}</span><b>{story.date}</b></div>
          <div className="article-sidebar-row"><span>{locale === "en" ? "Reading time" : "Час читання"}</span><b>{story.readTime}</b></div>
          <div className="article-sidebar-note">{locale === "en" ? "This briefing is based on the linked original publication. Follow the source for the full announcement and context." : "Цей матеріал підготовлено на основі першоджерела. Перейдіть до оригінальної публікації, щоб ознайомитися з повним контекстом."}</div>
          {story.sourceUrl && <a className="article-sidebar-source" href={story.sourceUrl} target="_blank" rel="noreferrer">{locale === "en" ? "Open original source" : "Відкрити першоджерело"} <span>↗</span></a>}
        </div>
      </aside></div>
      <section className="related-section"><div className="section-heading"><div><div className="section-kicker">{copy.continueReading}</div><h2>{copy.moreFrom}<span>.</span></h2></div></div><div className="feature-grid">{related.map((item) => <NewsCard key={item.slug} story={item} locale={locale} />)}</div></section>
    </article>
  );
}
