import Link from "next/link";
import { NewsCard } from "@/components/news-card";
import { stories } from "@/lib/stories";

export const metadata = {
  title: "Усі матеріали",
  description: "Усі демонстраційні матеріали Future Sphere про штучний інтелект, моделі, інструменти та дослідження."
};

export default function NewsPage() {
  return (
    <section className="listing-page page-shell">
      <div className="article-breadcrumb"><Link href="/">Головна</Link><span>/</span><span>Усі матеріали</span></div>
      <div className="listing-heading"><div className="section-kicker">БІБЛІОТЕКА FUTURE SPHERE</div><h1>Усі матеріали<span>.</span></h1><p>Добірка матеріалів про нові моделі, AI-інструменти, дослідження та технології. Зараз тут розміщені демонстраційні публікації.</p></div>
      <div className="news-listing-meta"><span>{stories.length} матеріалів</span><span><i /> Демонстраційна стрічка</span></div>
      <div className="listing-grid">{stories.map((story) => <NewsCard key={story.slug} story={story} />)}</div>
    </section>
  );
}
