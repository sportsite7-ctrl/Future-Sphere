import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/news-card";
import { stories } from "@/lib/stories";

export function generateStaticParams() { return stories.map((story) => ({ slug: story.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = stories.find((item) => item.slug === slug);
  return story ? { title: story.title, description: story.excerpt } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = stories.find((item) => item.slug === slug);
  if (!story) notFound();
  const related = stories.filter((item) => item.slug !== story.slug).slice(0, 2);
  return (
    <article className="article-page page-shell">
      <div className="article-breadcrumb"><Link href="/">Головна</Link><span>/</span><Link href={`/category/${story.categorySlug}`}>{story.category}</Link><span>/</span><span>Матеріал</span></div>
      <header className="article-header"><span className="article-category">{story.category} · ДЕМО-МАТЕРІАЛ</span><h1>{story.title}</h1><p className="article-deck">{story.excerpt}</p>
        <div className="article-byline"><span className="byline-avatar">FS</span><span><b>Редакція Future Sphere</b><small>{story.date} · {story.readTime}</small></span></div>
      </header>
      <div className="article-cover" style={{ backgroundImage: `url("${story.image}")` }} role="img" aria-label={story.imageAlt} />
      <div className="article-body-wrap"><div className="article-body">
        <div className="article-demo-note">ЦЕ ДЕМО-МАТЕРІАЛ. Текст створено для демонстрації структури майбутньої публікації.</div>
        {story.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <div className="article-source-note"><b>Примітка редакції</b><span>У робочій версії тут буде вказано першоджерело, авторство та пов'язані матеріали.</span></div>
        <Link href="/" className="back-link">← Повернутися до стрічки</Link>
      </div></div>
      <section className="related-section"><div className="section-heading"><div><div className="section-kicker">ПРОДОВЖИТИ ЧИТАТИ</div><h2>Ще у Future Sphere<span>.</span></h2></div></div><div className="feature-grid">{related.map((item) => <NewsCard key={item.slug} story={item} />)}</div></section>
    </article>
  );
}
