import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY secret.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const parser = new Parser({ timeout: 20000, headers: { "User-Agent": "FutureSphereNewsBot/1.0 (+https://future-sphere)" } });

const FEEDS = [
  { name: "OpenAI News", website: "https://openai.com/news/", url: "https://openai.com/news/rss.xml", category: "ai-models" },
  { name: "Hugging Face Blog", website: "https://huggingface.co/blog", url: "https://huggingface.co/blog/feed.xml", category: "tools" },
];

function clean(value = "") {
  return String(value).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
}
function validHttpUrl(value) {
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; }
  catch { return false; }
}
function makeSlug(value, suffix) {
  const slug = clean(value).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72);
  return slug || `news-${suffix.slice(0, 8)}`;
}

const { data: categories, error: categoriesError } = await supabase.from("categories").select("id,slug");
if (categoriesError) throw categoriesError;
const categoryMap = new Map((categories || []).map((item) => [item.slug, item.id]));
let imported = 0, skipped = 0, failed = 0;

for (const feedConfig of FEEDS) {
  try {
    const feed = await parser.parseURL(feedConfig.url);
    const { data: source, error: sourceError } = await supabase.from("sources")
      .upsert({
        name: feedConfig.name,
        website_url: feedConfig.website,
        feed_url: feedConfig.url,
        source_type: "rss",
        is_active: true,
      }, { onConflict: "feed_url" })
      .select("id").single();
    if (sourceError) throw sourceError;

    for (const item of (feed.items || []).slice(0, 25)) {
      const title = clean(item.title);
      const link = item.link || item.guid;
      if (!title || !validHttpUrl(link)) { skipped++; continue; }
      const publishedAt = item.isoDate || item.pubDate || new Date().toISOString();
      const excerpt = clean(item.contentSnippet || item.summary || item.content || item["content:encoded"] || "").slice(0, 420);
      const { data: article, error: articleError } = await supabase.from("articles")
        .upsert({
          category_id: categoryMap.get(feedConfig.category) || null,
          source_id: source.id,
          source_url: link,
          status: "draft",
          is_featured: false,
          published_at: Number.isNaN(Date.parse(publishedAt)) ? new Date().toISOString() : new Date(publishedAt).toISOString(),
        }, { onConflict: "source_url", ignoreDuplicates: true })
        .select("id").maybeSingle();
      if (articleError) throw articleError;
      if (!article) { skipped++; continue; }

      const slug = makeSlug(title, article.id);
      const translationRows = ["uk", "en"].map((lang) => ({
        article_id: article.id,
        lang,
        slug: `${slug}-${lang}`,
        title,
        excerpt: excerpt || title,
        body: excerpt || title,
        seo_title: title.slice(0, 65),
        seo_description: (excerpt || title).slice(0, 155),
      }));
      const { error: translationError } = await supabase.from("article_translations")
        .upsert(translationRows, { onConflict: "article_id,lang", ignoreDuplicates: true });
      if (translationError) throw translationError;
      imported++;
    }
    console.log(`Imported feed: ${feedConfig.name} (${feed.items?.length || 0} entries)`);
  } catch (error) {
    failed++;
    console.error(`Feed failed: ${feedConfig.name}`, error?.message || error);
  }
}
console.log(JSON.stringify({ imported, skipped, failed }));
if (failed === FEEDS.length) process.exit(1);
