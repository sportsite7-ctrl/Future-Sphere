import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard } from "@/components/news-card";
import { Pagination } from "@/components/pagination";
import { getStories } from "@/lib/content";
import { getLocale, localeUrl } from "@/lib/locale";
import { t, localizeStory } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hasRealStories = (await getStories(locale)).some((story) => !story.isDemo);
  return {
    title: locale === "en" ? "Latest AI News" : "Останні новини про штучний інтелект",
    description: locale === "en"
      ? "Browse the latest artificial intelligence news, model announcements, research and industry updates."
      : "Читайте останні новини про штучний інтелект, запуск моделей, дослідження та події індустрії.",
    alternates: { canonical: localeUrl(locale, "/news"), languages: { "uk-UA": localeUrl("uk", "/news"), "en-US": localeUrl("en", "/news") } },
    robots: hasRealStories ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const locale = await getLocale();
  const copy = t(locale);
  const homePath = `/${locale}`;
  const allItems = (await getStories(locale)).map((story) => localizeStory(story, locale));
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(allItems.length / pageSize));
  const requestedPage = Math.max(1, Number.parseInt((await searchParams).page || "1", 10) || 1);
  const page = Math.min(requestedPage, totalPages);
  const items = allItems.slice((page - 1) * pageSize, page * pageSize);
  return (
    <section className="listing-page page-shell">
      <div className="article-breadcrumb"><Link href={homePath}>{copy.home}</Link><span>/</span><span>{copy.allNews}</span></div>
      <div className="listing-heading"><div className="section-kicker">{copy.library}</div><h1>{copy.allNews}<span>.</span></h1><p>{copy.listingDescription}</p></div>
      <div className="news-listing-meta"><span>{allItems.length} {locale === "en" ? "stories" : "матеріалів"}</span>{allItems.every((story) => story.isDemo) && <span><i /> {copy.demoLabel}</span>}</div>
      <div className="listing-grid">{items.map((story) => <NewsCard key={story.slug} story={story} locale={locale} />)}</div>
      <Pagination page={page} totalPages={totalPages} basePath="/news" locale={locale} />
    </section>
  );
}
