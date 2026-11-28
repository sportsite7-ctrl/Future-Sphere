import { getStories } from "@/lib/content";

export const dynamic = "force-dynamic";

const siteUrl = "https://future-sphere-henna.vercel.app";
const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const [ukStories, enStories] = await Promise.all([
    getStories("uk"),
    getStories("en"),
  ]);

  const now = Date.now();
  const newsCutoff = now - 2 * 24 * 60 * 60 * 1000;
  const allStories = [
    ...ukStories
      .filter((story) => !story.isDemo)
      .map((story) => ({ story, locale: "uk" as const })),
    ...enStories
      .filter((story) => !story.isDemo)
      .map((story) => ({ story, locale: "en" as const })),
  ];

  const recentNews = allStories
    .filter(({ story }) => {
      if (!story.publishedAt) return false;
      const publishedAt = new Date(story.publishedAt).getTime();
      return Number.isFinite(publishedAt) && publishedAt <= now && publishedAt >= newsCutoff;
    })
    .slice(0, 1000);

  let urls: string;

  if (recentNews.length > 0) {
    // Google News metadata is included only for articles published in the last 48 hours.
    urls = recentNews
      .map(({ story, locale }) => {
        const language = locale;
        const loc = `${siteUrl}/${locale}/article/${encodeURIComponent(story.slug)}`;
        const date = new Date(story.publishedAt!).toISOString();
        return `<url><loc>${escapeXml(loc)}</loc><news:news><news:publication><news:name>Future Sphere</news:name><news:language>${language}</news:language></news:publication><news:publication_date>${date}</news:publication_date><news:title>${escapeXml(story.title)}</news:title></news:news></url>`;
      })
      .join("");
  } else {
    // Keep the endpoint a valid, crawlable XML sitemap when there are no
    // qualifying Google News articles. Older stories are listed as ordinary
    // URLs and are deliberately NOT marked as Google News articles.
    const fallbackStories = allStories.slice(0, 1000);
    const fallbackUrls = fallbackStories.map(({ story, locale }) => {
      const loc = `${siteUrl}/${locale}/article/${encodeURIComponent(story.slug)}`;
      const lastmod = story.publishedAt
        ? `<lastmod>${new Date(story.publishedAt).toISOString()}</lastmod>`
        : "";
      return `<url><loc>${escapeXml(loc)}</loc>${lastmod}</url>`;
    });

    if (fallbackUrls.length === 0) {
      fallbackUrls.push(
        `<url><loc>${siteUrl}/uk</loc></url>`,
        `<url><loc>${siteUrl}/en</loc></url>`,
      );
    }
    urls = fallbackUrls.join("");
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60",
    },
  });
}
