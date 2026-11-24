import Link from "next/link";
import { NewsCard } from "@/components/news-card";
import { getStories } from "@/lib/content";
import { getLocale } from "@/lib/locale";
import { t, localizeStory } from "@/lib/i18n";

export default async function NewsPage() {
  const locale = await getLocale();
  const copy = t(locale);
  const items = (await getStories(locale)).map((story) => localizeStory(story, locale));
  return (
    <section className="listing-page page-shell">
      <div className="article-breadcrumb"><Link href="/">{copy.home}</Link><span>/</span><span>{copy.allNews}</span></div>
      <div className="listing-heading"><div className="section-kicker">{copy.library}</div><h1>{copy.allNews}<span>.</span></h1><p>{copy.listingDescription}</p></div>
      <div className="news-listing-meta"><span>{items.length} {locale === "en" ? "stories" : "матеріалів"}</span>{items.every((story) => story.isDemo) && <span><i /> {copy.demoLabel}</span>}</div>
      <div className="listing-grid">{items.map((story) => <NewsCard key={story.slug} story={story} locale={locale} />)}</div>
    </section>
  );
}
