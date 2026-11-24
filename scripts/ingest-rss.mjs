import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
const primaryModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const fallbackModels = [
  primaryModel,
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
].filter((model, index, all) => all.indexOf(model) === index);

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

  let lastError;
  for (const model of fallbackModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(geminiKey)}`;
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
        const error = new Error(message);
        error.status = response.status;
        throw error;
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
      console.log(`Gemini model selected: ${model}`);
      return { editorial: result, model };
    } catch (error) {
      lastError = error;
      const status = error?.status;
      const retryable = !status || status === 408 || status === 429 || status >= 500 || status === 404 || status === 400;
      console.error(`Gemini model ${model} failed (HTTP ${status || "network/parse"}): ${error?.message || error}`);
      if (!retryable) break;
      await wait(700);
    }
  }
  throw new Error(`All Gemini models failed. Last error: ${lastError?.message || lastError}`);
}

async function findOrCreateSource(feedConfig) {
  const { data: existing, error: lookupError } = await supabase.from("sources")
    .select("id")
    .eq("feed_url", feedConfig.url)
    .maybeSingle();
  if (lookupError) throw lookupError;

  const values = {
    name: feedConfig.name,
    website_url: feedConfig.website,
    feed_url: feedConfig.url,
    source_type: "rss",
    is_active: true,
  };
  if (existing) {
    const { data, error } = await supabase.from("sources")
      .update(values).eq("id", existing.id).select("id").single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from("sources")
    .insert(values).select("id").single();
  if (error) throw error;
  return data;
}

async function findOrCreateArticle({ link, sourceId, categoryId, publishedAt }) {
  const { data: existing, error: lookupError } = await supabase.from("articles")
    .select("id,status,category_id")
    .eq("source_url", link)
    .maybeSingle();
  if (lookupError) throw lookupError;
  if (existing) return existing;

  const { data, error } = await supabase.from("articles")
    .insert({
      category_id: categoryId,
      source_id: sourceId,
      source_url: link,
      status: "draft",
      is_featured: false,
      published_at: Number.isNaN(Date.parse(publishedAt))
        ? new Date().toISOString()
        : new Date(publishedAt).toISOString(),
    })
    .select("id,status,category_id").single();
  if (error) {
    // If a concurrent run inserted the same source URL, fetch that row instead.
    const { data: raced, error: racedError } = await supabase.from("articles")
      .select("id,status,category_id").eq("source_url", link).maybeSingle();
    if (racedError || !raced) throw error;
    return raced;
  }
  return data;
}

async function saveTranslations(articleId, editorial) {
  for (const lang of ["uk", "en"]) {
    const value = editorial[lang];
    const slug = makeSlug(value.title, articleId);
    const row = {
      article_id: articleId,
      lang,
      slug: `${slug}-${lang}`,
      title: value.title,
      excerpt: value.excerpt,
      body: value.body,
      seo_title: value.title.slice(0, 65),
      seo_description: value.excerpt.slice(0, 155),
    };
    const { data: existing, error: lookupError } = await supabase.from("article_translations")
      .select("id").eq("article_id", articleId).eq("lang", lang).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) {
      const { error } = await supabase.from("article_translations")
        .update(row).eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("article_translations").insert(row);
      if (error) throw error;
    }
  }
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
    const source = await findOrCreateSource(feedConfig);

    for (const item of (feed.items || []).slice(0, 25)) {
      const originalTitle = clean(item.title);
      const link = item.link || item.guid;
      if (!originalTitle || !validHttpUrl(link)) {
        skipped++;
        continue;
      }

      const publishedAt = item.isoDate || item.pubDate || new Date().toISOString();
      const originalExcerpt = clean(item.contentSnippet || item.summary || item.content || item["content:encoded"] || "").slice(0, 1200);
      const article = await findOrCreateArticle({
        link,
        sourceId: source.id,
        categoryId: categoryMap.get(feedConfig.category) || null,
        publishedAt,
      });

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
        const generated = await generateEditorialPackage({
          title: originalTitle,
          excerpt: originalExcerpt,
          sourceUrl: link,
          sourceName: feedConfig.name,
        });
        const editorial = generated.editorial;
        const categoryId = categoryMap.get(editorial.category) || categoryMap.get(feedConfig.category) || null;

        if (article.status === "draft") {
          const { error: updateArticleError } = await supabase.from("articles")
            .update({ category_id: categoryId }).eq("id", article.id).eq("status", "draft");
          if (updateArticleError) throw updateArticleError;
        }
        await saveTranslations(article.id, editorial);

        aiProcessed++;
        imported++;
        console.log(`Gemini processed with ${generated.model}: ${originalTitle.slice(0, 100)}`);
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

const summary = { imported, skipped, failed, feedFailures, aiProcessed, aiAlreadyDone, modelOrder: fallbackModels };
console.log(JSON.stringify(summary));
if (feedFailures === FEEDS.length) process.exit(1);
if (aiProcessed === 0 && failed > 0) process.exit(1);
