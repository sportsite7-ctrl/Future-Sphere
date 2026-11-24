# Future Sphere RSS ingestion

## What it does
- Runs every 3 hours through GitHub Actions, and can be started manually.
- Reads configured RSS feeds and deduplicates articles by source URL.
- Stores imported items in Supabase as `draft` records.
- Adds Ukrainian and English placeholder translation rows from feed metadata.
- Does not publish automatically and does not copy full source articles.

## Required GitHub Actions secrets
Add these in the Future-Sphere repository under Settings → Secrets and variables → Actions:
- `SUPABASE_URL`: the project's Supabase URL.
- `SUPABASE_SERVICE_ROLE_KEY`: the Supabase service-role key.

Never expose the service-role key in frontend variables, source files, commits, or chat.

## One-time Supabase migration
Run `supabase/migrations/003_rss_ingestion.sql` in Supabase SQL Editor. It adds unique indexes used for safe deduplication.

## Current sources
- OpenAI News: https://openai.com/news/rss.xml
- Hugging Face Blog: https://huggingface.co/blog/feed.xml

Imported records remain drafts. Human/editorial review and proper original-language summaries/translations must be added before publishing.
