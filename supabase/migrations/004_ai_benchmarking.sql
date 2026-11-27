-- Evidence-first AI model benchmarking for Future Sphere.
-- No scores or model entries are seeded: only sourced results may be published.

create table if not exists public.ai_models (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  provider text not null,
  model_family text,
  release_date date,
  official_url text,
  model_type text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_models_official_url_valid check (official_url is null or official_url ~ '^https?://')
);

create table if not exists public.ai_benchmarks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  description text,
  methodology_url text not null,
  leaderboard_url text,
  higher_is_better boolean not null default true,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_benchmarks_methodology_url_valid check (methodology_url ~ '^https?://'),
  constraint ai_benchmarks_leaderboard_url_valid check (leaderboard_url is null or leaderboard_url ~ '^https?://')
);

create table if not exists public.ai_benchmark_results (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.ai_models(id) on delete cascade,
  benchmark_id uuid not null references public.ai_benchmarks(id) on delete cascade,
  score numeric(14,5) not null,
  score_unit text not null,
  evaluation_date date not null,
  evaluation_version text not null,
  harness text not null,
  sample_size integer,
  evidence_grade text not null check (evidence_grade in ('independent', 'provider_reported', 'aggregated')),
  notes text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_benchmark_results_sample_positive check (sample_size is null or sample_size > 0),
  constraint ai_benchmark_results_unique_run unique (model_id, benchmark_id, evaluation_version, harness)
);

create table if not exists public.ai_benchmark_evidence (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null references public.ai_benchmark_results(id) on delete cascade,
  source_title text not null,
  source_url text not null,
  source_type text not null check (source_type in ('benchmark_owner', 'independent_lab', 'model_provider', 'research_paper', 'reputable_aggregator')),
  published_at date,
  checked_at timestamptz not null default now(),
  notes text,
  constraint ai_benchmark_evidence_url_valid check (source_url ~ '^https?://')
);

create index if not exists ai_benchmark_results_public_idx
  on public.ai_benchmark_results (benchmark_id, evaluation_date desc)
  where is_published = true;
create index if not exists ai_benchmark_evidence_result_idx
  on public.ai_benchmark_evidence (result_id);

alter table public.ai_models enable row level security;
alter table public.ai_benchmarks enable row level security;
alter table public.ai_benchmark_results enable row level security;
alter table public.ai_benchmark_evidence enable row level security;

drop policy if exists "Public can read published AI models" on public.ai_models;
create policy "Public can read published AI models" on public.ai_models
  for select to anon, authenticated using (is_published = true);

drop policy if exists "Public can read published benchmarks" on public.ai_benchmarks;
create policy "Public can read published benchmarks" on public.ai_benchmarks
  for select to anon, authenticated using (is_published = true);

drop policy if exists "Public can read published benchmark results" on public.ai_benchmark_results;
create policy "Public can read published benchmark results" on public.ai_benchmark_results
  for select to anon, authenticated using (
    is_published = true
    and exists (select 1 from public.ai_models m where m.id = model_id and m.is_published = true)
    and exists (select 1 from public.ai_benchmarks b where b.id = benchmark_id and b.is_published = true)
  );

drop policy if exists "Public can read evidence for published results" on public.ai_benchmark_evidence;
create policy "Public can read evidence for published results" on public.ai_benchmark_evidence
  for select to anon, authenticated using (
    exists (
      select 1 from public.ai_benchmark_results r
      join public.ai_models m on m.id = r.model_id and m.is_published = true
      join public.ai_benchmarks b on b.id = r.benchmark_id and b.is_published = true
      where r.id = result_id and r.is_published = true
    )
  );

comment on table public.ai_benchmark_results is
  'Publish only benchmark scores with a traceable evidence row. Never combine different benchmark versions or harnesses into one rank.';
