import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";

if (!supabaseUrl || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY secret.");
  process.exit(1);
}
if (!geminiKey) {
  console.error("Missing GEMINI_API_KEY secret.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const parser = new Parser({
  timeout: 20000,
  headers: { "User-Agent": "FutureSphereNewsBot/1.0 (+https://future-sphere)" },
});

const FEEDS = [
  { name: "OpenAI News", website: "https://openai.com/news/", url: "https://openai.com/news/rss.xml", category: "ai-models" },
  { name: "Hugging Face Blog", website: "https://huggingface.co/blog", url: "https://huggingface.co/blog/feed.xml", category: "tools" },
];
const MAX_AI_ITEMS_PER_RUN = 5;
const AI_DELAY_MS = 1500;

function clean(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
function validHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
function makeSlug(value, suffix) {
  const slug = clean(value).toLowerCase().normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72);
  return slug || `news-${String(suffix).slice(0, 8)}`;
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function parseJsonResponse(text) {
  const trimmed = String(text || "").trim()
    .replace(/^\uFEFF/, "")
    .replace(/^\`\`\`(?:json)?\s*/i, "")
    .replace(/\s*\`\`\`$/, "");
  return JSON.parse(trimmed);
}

async function generateEditorialPackage({ title, excerpt, sourceUrl, sourceName }) {
  const prompt = `You are the careful bilingual editor of Future Sphere, an AI and technology news publication.

Use ONLY the facts explicitly present in the supplied RSS title and description. Do not browse, invent details, infer numbers, add quotes, or claim you read the full linked article. The RSS description may be incomplete. If it contains little information, write a short cautious summary rather than filling gaps.

Create two editorial versions of the same item: Ukrainian (uk) and English (en). Translate and rewrite naturally; do not merely copy the same English text into both languages. Keep names of products, models, companies, and technical terms accurate.

Return valid JSON only, with exactly this structure:
{
  "category": "ai-models | tools | research | technology | industry",
  "uk": { "title": "string", "excerpt": "string", "body": "string" },
  "en": { "title": "string", "excerpt": "string", "body": "string" }
}

Rules:
- Titles: informative, neutral, no clickbait, ideally under 100 characters.
- Excerpts: one or two sentences, about 20-45 words.
- Body: 2-3 short paragraphs, about 70-130 words total, using only the supplied facts. If the description is too thin, body may be shorter.
- The body must clearly frame the item as a report based on the source's published announcement/post, not as independently verified fact.
- Do not include unsupported dates, prices, benchmarks, availability claims, or feature details.
- Category must be exactly one of the five allowed slugs.
- No markdown fences, HTML, citations, or extra keys.

Source name: ${sourceName}
Source URL: ${sourceUrl}
RSS title: ${title}
RSS description: ${excerpt || "(No description supplied)"}`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiKey)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(35000),
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        maxOutputTokens: 1400,
      },
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || `Gemini API returned HTTP ${response.status}`;
    throw new Error(message);
  }
  const outputText = payload?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "").join("").trim();
  if (!outputText) throw new Error("Gemini returned an empty response.");

  const result = parseJsonResponse(outputText);
  const allowedCategories = new Set(["ai-models", "tools", "research", "technology", "industry"]);
  if (!allowedCategories.has(result.category)) result.category = "technology";
  for (const lang of ["uk", "en"]) {
    const item = result[lang];
    if (!item || !clean(item.title) || !clean(item.excerpt) || !clean(item.body)) {
      throw new Error(`Gemini response is missing valid ${lang} editorial fields.`);
    }
    item.title = clean(item.title).slice(0, 180);
    item.excerpt = clean(item.excerpt).slice(0, 600);
    item.body = String(item.body).trim().slice(0, 5000);
  }
  return result;
}

const { data: categories, error: categoriesError } = await supabase
  .from("categories").select("id,slug");
if (categoriesError) throw categoriesError;
const categoryMap = new Map((categories || []).map((item) => [item.slug, item.id]));

let imported = 0;
let skipped = 0;
let failed = 0;
let aiProcessed = 0;
let aiAlreadyDone = 0;
let feedFailures = 0;

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
      const originalTitle = clean(item.title);
      const link = item.link || item.guid;
      if (!originalTitle || !validHttpUrl(link)) {
        skipped++;
        continue;
      }

      const publishedAt = item.isoDate || item.pubDate || new Date().toISOString();
      const originalExcerpt = clean(item.contentSnippet || item.summary || item.content || item["content:encoded"] || "").slice(0, 1200);

      const { data: insertedArticle, error: articleError } = await supabase.from("articles")
        .upsert({
          category_id: categoryMap.get(feedConfig.category) || null,
          source_id: source.id,
          source_url: link,
          status: "draft",
          is_featured: false,
          published_at: Number.isNaN(Date.parse(publishedAt))
            ? new Date().toISOString()
            : new Date(publishedAt).toISOString(),
        }, { onConflict: "source_url", ignoreDuplicates: true })
        .select("id").maybeSingle();
      if (articleError) throw articleError;

      let article = insertedArticle;
      if (!article) {
        const { data: existingArticle, error: lookupError } = await supabase.from("articles")
          .select("id,status,category_id")
          .eq("source_url", link)
          .maybeSingle();
        if (lookupError) throw lookupError;
        article = existingArticle;
      }
      if (!article) {
        skipped++;
        continue;
      }

      const { data: existingTranslations, error: translationsReadError } = await supabase
        .from("article_translations")
        .select("lang,title,excerpt,body")
        .eq("article_id", article.id);
      if (translationsReadError) throw translationsReadError;

      const translationsByLang = new Map((existingTranslations || []).map((row) => [row.lang, row]));
      const hasEditorialContent = ["uk", "en"].every((lang) => {
        const row = translationsByLang.get(lang);
        if (!row?.body) return false;
        const body = String(row.body).trim();
        return body !== String(row.excerpt || "").trim()
          && body !== String(row.title || "").trim()
          && body.length > 40;
      });
      if (hasEditorialContent) {
        aiAlreadyDone++;
        skipped++;
        continue;
      }

      if (aiProcessed >= MAX_AI_ITEMS_PER_RUN) {
        skipped++;
        continue;
      }

      try {
        const editorial = await generateEditorialPackage({
          title: originalTitle,
          excerpt: originalExcerpt,
          sourceUrl: link,
          sourceName: feedConfig.name,
        });
        const categoryId = categoryMap.get(editorial.category) || categoryMap.get(feedConfig.category) || null;
        const { error: updateArticleError } = await supabase.from("articles")
          .update({ category_id: categoryId })
          .eq("id", article.id)
          .eq("status", "draft");
        if (updateArticleError) throw updateArticleError;

        const translationRows = ["uk", "en"].map((lang) => {
          const value = editorial[lang];
          const slug = makeSlug(value.title, article.id);
          return {
            article_id: article.id,
            lang,
            slug: `${slug}-${lang}`,
            title: value.title,
            excerpt: value.excerpt,
            body: value.body,
            seo_title: value.title.slice(0, 65),
            seo_description: value.excerpt.slice(0, 155),
          };
        });
        const { error: translationError } = await supabase.from("article_translations")
          .upsert(translationRows, { onConflict: "article_id,lang" });
        if (translationError) throw translationError;

        aiProcessed++;
        imported++;
        console.log(`Gemini processed: ${originalTitle.slice(0, 100)}`);
        await wait(AI_DELAY_MS);
      } catch (error) {
        failed++;
        console.error(`AI processing failed for ${link}:`, error?.message || error);
      }
    }
    console.log(`RSS feed checked: ${feedConfig.name} (${feed.items?.length || 0} entries)`);
  } catch (error) {
    feedFailures++;
    console.error(`Feed failed: ${feedConfig.name}`, error?.message || error);
  }
}

const summary = { imported, skipped, failed, feedFailures, aiProcessed, aiAlreadyDone, model: geminiModel };
console.log(JSON.stringify(summary));
if (feedFailures === FEEDS.length) process.exit(1);
if (aiProcessed === 0 && failed > 0) process.exit(1);
