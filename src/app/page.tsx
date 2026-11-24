import Link from "next/link";
import { NewsCard } from "@/components/news-card";
import { BrandSymbol } from "@/components/brand-symbol";
import { categories, stories } from "@/lib/stories";

export default function HomePage() {
  const lead = stories[0];
  const secondary = stories.slice(1, 3);
  const latest = stories.slice(3);
  return (
    <>
      <section className="hero-section page-shell">
        <div className="hero-intro">
          <div className="eyebrow"><span className="eyebrow-dot" /> THE AI BRIEFING <span className="eyebrow-line" /> 24.11.2026</div>
          <h1>Майбутнє вже <span>відбувається.</span></h1>
          <p>Головне зі світу штучного інтелекту. Без зайвого шуму — з контекстом, поясненнями та ідеями.</p>
          <div className="hero-actions"><Link href="/category/ai-models" className="button-primary">Досліджувати AI <span>↗</span></Link><Link href="/about" className="button-quiet">Як це працює <span>→</span></Link></div>
        </div>
        <Link href={`/article/${lead.slug}`} className="lead-story">
          <div className="lead-image" style={{ backgroundImage: `url("${lead.image}")` }} /><div className="lead-overlay" />
          <div className="lead-content">
            <div className="lead-topline"><span className="lead-label">ВИБІР РЕДАКЦІЇ · ДЕМО</span><span>{lead.readTime}</span></div>
            <div><span className="lead-category">{lead.category}</span><h2>{lead.title}</h2><p>{lead.excerpt}</p><span className="lead-read">Читати матеріал <b>↗</b></span></div>
          </div>
        </Link>
      </section>

      <section className="category-strip page-shell"><div className="section-kicker">НАВІГАЦІЯ</div><div className="category-pills">
        {categories.map((category) => <Link key={category.slug} href={`/category/${category.slug}`} className="category-pill">{category.name}<span>↗</span></Link>)}
      </div></section>

      <section className="content-section page-shell">
        <div className="section-heading"><div><div className="section-kicker">ВАРТО ЗНАТИ</div><h2>Ідеї, що формують завтра<span>.</span></h2></div><Link href="/news" className="view-all">Усі матеріали <span>↗</span></Link></div>
        <div className="feature-grid">{secondary.map((story) => <NewsCard key={story.slug} story={story} />)}</div>
      </section>

      <section className="latest-section"><div className="page-shell latest-layout">
        <div className="latest-main"><div className="section-heading"><div><div className="section-kicker">СВІЖИЙ ПОГЛЯД</div><h2>Останні матеріали<span>.</span></h2></div><span className="demo-status"><i /> Демо-стрічка</span></div>
          <div className="latest-grid">{latest.map((story) => <NewsCard key={story.slug} story={story} />)}</div>
          <Link href="/news" className="text-link all-news-link">Переглянути всі матеріали <span>↗</span></Link>
        </div>
        <aside className="editorial-aside">
          <div className="aside-card aside-note"><span className="aside-number">01 / ПРИНЦИП</span><div className="aside-orbit"><span /><i /><b /></div><h3>Менше шуму.<br />Більше розуміння.</h3><p>Ми пояснюємо не лише що сталося, а й чому це має значення.</p><Link href="/about" className="text-link">Наш редакційний підхід <span>↗</span></Link></div>
          <div className="aside-card aside-topics"><span className="aside-number">У ФОКУСІ</span><h3>Теми, за якими варто стежити</h3><ul><li><Link href="/category/ai-models">Нові AI-моделі <span>↗</span></Link></li><li><Link href="/category/tools">AI-інструменти <span>↗</span></Link></li><li><Link href="/category/research">Відкриті дослідження <span>↗</span></Link></li><li><Link href="/category/technology">Нові технології <span>↗</span></Link></li></ul></div>
        </aside>
      </div></section>

      <section className="manifesto page-shell"><div className="manifesto-mark"><BrandSymbol large /></div><div><div className="section-kicker">FUTURE SPHERE</div><h2>Зрозуміти технології.<br /><span>Побачити можливості.</span></h2></div><p>Ми створюємо простір, де складні технології стають зрозумілими, а важливі відкриття не губляться серед інформаційного потоку.</p></section>
    </>
  );
}
