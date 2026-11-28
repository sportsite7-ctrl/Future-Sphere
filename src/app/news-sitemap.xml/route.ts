import { getStories } from "@/lib/content";

const siteUrl = "https://future-sphere-henna.vercel.app";
const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export async function GET() {
  const [ukStories, enStories] = await Promise.all([getStories("uk"), getStories("en")]);
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const entries = [
    ...ukStories.filter((story) => !story.isDemo && story.publishedAt && new Date(story.publishedAt).getTime() >= cutoff).map((story) => ({ story, locale: "uk" as const })),
    ...enStories.filter((story) => !story.isDemo && story.publishedAt && new Date(story.publishedAt).getTime() >= cutoff).map((story) => ({ story, locale: "en" as const }))
  ].slice(0, 1000);

  const urls = entries.map(({ story, locale }) => {
    const language = locale === "uk" ? "uk" : "en";
    const loc = `${siteUrl}/${locale}/article/${encodeURIComponent(story.slug)}`;
    const date = new Date(story.publishedAt!).toISOString();
    return `<url><loc>${escapeXml(loc)}</loc><news:news><news:publication><news:name>Future Sphere</news:name><news:language>${language}</news:language></news:publication><news:publication_date>${date}</news:publication_date><news:title>${escapeXml(story.title)}</news:title></news:news></url>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
}
