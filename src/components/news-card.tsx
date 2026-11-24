import Link from "next/link";
import type { Story } from "@/lib/stories";

export function NewsCard({ story }: { story: Story }) {
  return (
    <article className="news-card">
      <Link href={`/article/${story.slug}`} className="card-image-link" aria-label={story.title}>
        <div className="card-image" style={{ backgroundImage: `url("${story.image}")` }}><span className="image-category">{story.category}</span></div>
      </Link>
      <div className="card-copy">
        <div className="card-meta"><span>{story.date}</span><i /> <span>{story.readTime}</span></div>
        <h3><Link href={`/article/${story.slug}`}>{story.title}</Link></h3>
        <p>{story.excerpt}</p>
        <Link className="text-link" href={`/article/${story.slug}`}>Читати матеріал <span>↗</span></Link>
      </div>
    </article>
  );
}
