-- Future Sphere: article image metadata
-- Run this migration in Supabase SQL Editor (safe to run once).
alter table public.articles
  add column if not exists image_url text,
  add column if not exists image_alt text,
  add column if not exists image_credit text,
  add column if not exists image_source_url text,
  add column if not exists image_width integer,
  add column if not exists image_height integer;

alter table public.articles
  add constraint articles_image_width_positive
  check (image_width is null or image_width > 0) not valid;

alter table public.articles
  add constraint articles_image_height_positive
  check (image_height is null or image_height > 0) not valid;
