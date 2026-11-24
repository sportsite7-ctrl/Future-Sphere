-- Future Sphere RSS ingestion: safe deduplication keys for source items and translations.
-- RSS records are imported as drafts; they are not published automatically.
create unique index if not exists sources_feed_url_unique
  on public.sources (feed_url)
  where feed_url is not null;

create unique index if not exists articles_source_url_unique
  on public.articles (source_url)
  where source_url is not null;

create unique index if not exists article_translations_article_lang_unique
  on public.article_translations (article_id, lang);
