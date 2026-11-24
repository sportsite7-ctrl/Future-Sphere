import Link from "next/link";
import { NewsCard } from "@/components/news-card";
import { BrandSymbol } from "@/components/brand-symbol";
import { categories, stories } from "@/lib/stories";
import { getLocale, t } from "@/lib/i18n";
import { localizeStory } from "@/lib/i18n";

export default async function HomePage() {
  const locale = await getLocale();
  const copy = t(locale);
  const lead = localizeStory(stories[0], locale);
  const secondary = stories.slice(1, 3).map((story) => localizeStory(story, locale));
  const latest = stories.slice(3).map((story) => localizeStory(story, locale));
  return (
    <>
      <section className="hero-section page-shell">
        <div className="hero-intro">
          <div className="eyebrow"><span className="eyebrow-dot" /> {copy.heroEyebrow} <span className="eyebrow-line" /> 24.11.2026</div>
          <h1>{copy.heroTitleA} <span>{copy.heroTitleB}</span></h1>
          <p>{copy.heroText}</p>
          <div className="hero-actions"><Link href="/category/ai-models" className="button-primary">{copy.explore} <span>↗</span></Link><Link href="/about" className="button-quiet">{copy.howItWorks} <span>→</span></Link></div>
        </div>
        <Link href={`/article/${lead.slug}`} className="lead-story">
          <div className="lead-image" style={{ backgroundImage: `url("${lead.image}")` }} /><div className="lead-overlay" />
          <div className="lead-content">
            <div className="lead-topline"><span className="lead-label">{copy.editorPick}</span><span>{lead.readTime}</span></div>
            <div><span className="lead-category">{lead.category}</span><h2>{lead.title}</h2><p>{lead.excerpt}</p><span className="lead-read">{copy.read} <b>↗</b></span></div>
          </div>
        </Link>
      </section>
      <section className="category-strip page-shell"><div className="section-kicker">{copy.navigation}</div><div className="category-pills">
        {categories.map((category) => <Link key={category.slug} href={`/category/${category.slug}`} className="category-pill">{copy.categories[category.slug as keyof typeof copy.categories][0]}<span>↗</span></Link>)}
      </div></section>
      <section className="content-section page-shell">
        <div className="section-heading"><div><div className="section-kicker">{copy.worthKnowing}</div><h2>{copy.ideas}<span>.</span></h2></div><Link href="/news" className="view-all">{copy.allMaterials} <span>↗</span></Link></div>
        <div className="feature-grid">{secondary.map((story) => <NewsCard key={story.slug} story={story} locale={locale} />)}</div>
      </section>
      <section className="latest-section"><div className="page-shell latest-layout">
        <div className="latest-main"><div className="section-heading"><div><div className="section-kicker">{copy.freshView}</div><h2>{copy.latest}<span>.</span></h2></div><span className="demo-status"><i /> {copy.demoFeed}</span></div>
          <div className="latest-grid">{latest.map((story) => <NewsCard key={story.slug} story={story} locale={locale} />)}</div>
          <Link href="/news" className="text-link all-news-link">{copy.allMaterials} <span>↗</span></Link>
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
