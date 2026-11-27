import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard } from "@/components/news-card";
import { NewsImage } from "@/components/news-image";
import { BrandSymbol } from "@/components/brand-symbol";
import { getCategories, getStories } from "@/lib/content";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { localizeStory } from "@/lib/i18n";
import { Pagination } from "@/components/pagination";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "en" ? "AI News, Research & Tools" : "Новини ШІ, дослідження та інструменти",
    description: locale === "en"
      ? "Follow the latest AI news, model releases, research and tools with context and links to original sources."
      : "Останні новини штучного інтелекту, нові моделі, дослідження та інструменти з поясненнями й посиланнями на першоджерела.",
    alternates: { canonical: "/" },
  };
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const locale = await getLocale();
  const copy = t(locale);
  const [{ page: pageParam }, stories, categories] = await Promise.all([searchParams, getStories(locale), getCategories(locale)]);
  const orderedStories = [...stories].sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)));
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(orderedStories.length / pageSize));
  const requestedPage = Math.max(1, Number.parseInt(pageParam || "1", 10) || 1);
  const page = Math.min(requestedPage, totalPages);
  const pageStories = orderedStories.slice((page - 1) * pageSize, page * pageSize);
  const lead = localizeStory(pageStories[0] || orderedStories[0], locale);
  const secondary = pageStories.slice(1, 3).map((story) => localizeStory(story, locale));
  const latest = pageStories.slice(3, 5).map((story) => localizeStory(story, locale));
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Future Sphere",
    alternateName: "FutureSphere",
    url: "https://future-sphere-henna.vercel.app/"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData).replace(/</g, "\\u003c") }} />

      <section className="hero-section page-shell">
        <div className="hero-intro">
          <div className="eyebrow"><span className="eyebrow-dot" /> {copy.heroEyebrow} <span className="eyebrow-line" /> {lead.date}</div>
          <h1>{copy.heroTitleA} <span>{copy.heroTitleB}</span></h1>
          <p>{copy.heroText}</p>
          <div className="hero-actions"><Link href="/category/ai-models" className="button-primary">{copy.explore} <span>↗</span></Link><Link href="/about" className="button-quiet">{copy.howItWorks} <span>→</span></Link></div>
        </div>
        <Link href={`/article/${lead.slug}`} className="lead-story">
          <NewsImage src={lead.image} alt={lead.imageAlt} className="lead-image" priority /><div className="lead-overlay" />
          <div className="lead-content">
            <div className="lead-topline"><span className="lead-label">{copy.editorPick}</span><span>{lead.readTime}</span></div>
            <div><span className="lead-category">{lead.category}</span><h2>{lead.title}</h2><p>{lead.excerpt}</p><span className="lead-read">{copy.read} <b>↗</b></span></div>
          </div>
        </Link>
      </section>
      <section className="category-strip page-shell"><div className="section-kicker">{copy.navigation}</div><div className="category-pills">
        {categories.map((category) => <Link key={category.slug} href={`/category/${category.slug}`} className="category-pill">{category.name}<span>↗</span></Link>)}
      </div></section>
      <section className="content-section page-shell">
        <div className="section-heading"><div><div className="section-kicker">{copy.worthKnowing}</div><h2>{copy.ideas}<span>.</span></h2></div><Link href="/news" className="view-all">{copy.allMaterials} <span>↗</span></Link></div>
        <div className="feature-grid">{secondary.map((story) => <NewsCard key={story.slug} story={story} locale={locale} />)}</div>
      </section>
      <section className="latest-section"><div className="page-shell latest-layout">
        <div className="latest-main"><div className="section-heading"><div><div className="section-kicker">{copy.freshView}</div><h2>{copy.latest}<span>.</span></h2></div>{latest.some((story) => story.isDemo) || lead.isDemo ? <span className="demo-status"><i /> {copy.demoFeed}</span> : <span className="demo-status"><i /> {locale === "en" ? "Published stories" : "Опубліковані матеріали"}</span>}</div>
          <div className="latest-grid">{latest.map((story) => <NewsCard key={story.slug} story={story} locale={locale} />)}</div>
          <Link href="/news" className="text-link all-news-link">{copy.allMaterials} <span>↗</span></Link>
          <Pagination page={page} totalPages={totalPages} basePath="/" locale={locale} />
        </div>
        <aside className="editorial-aside">
          <div className="aside-card aside-note"><span className="aside-number">01 / {locale === "en" ? "PRINCIPLE" : "ПРИНЦИП"}</span><div className="aside-orbit"><span /><i /><b /></div><h3>{copy.lessNoise}<br />{copy.moreUnderstanding}</h3><p>{copy.editorialText}</p><Link href="/about" className="text-link">{copy.editorialApproach} <span>↗</span></Link></div>
          <div className="aside-card aside-topics"><span className="aside-number">{copy.focus}</span><h3>{copy.focusTitle}</h3><ul><li><Link href="/category/ai-models">{copy.newModels} <span>↗</span></Link></li><li><Link href="/category/tools">{copy.aiTools} <span>↗</span></Link></li><li><Link href="/category/research">{copy.openResearch} <span>↗</span></Link></li><li><Link href="/category/technology">{copy.newTech} <span>↗</span></Link></li></ul></div>
        </aside>
      </div></section>
      <section className="manifesto page-shell"><div className="manifesto-mark"><BrandSymbol large /></div><div><div className="section-kicker">FUTURE SPHERE</div><h2>{copy.manifestoTitle}<br /><span>{copy.manifestoSub}</span></h2></div><p>{copy.manifestoText}</p></section>
    </>
  );
}
