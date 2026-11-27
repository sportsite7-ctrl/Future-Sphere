-- Add a cross-provider model directory and a single comparable Arena Agent Arena Index snapshot.
-- Scores are copied from Arena's official public leaderboard, checked 2026-11-27.
-- This is an Arena leaderboard/aggregator result, not a provider claim or a raw benchmark score.
-- Exact leaderboard configuration labels are preserved as model names.

insert into public.ai_models
  (slug, name, provider, model_family, official_url, model_type, is_published)
values
  ('claude-fable-5-2-max', 'Claude Fable 5.2 (Max)', 'Anthropic', 'Claude Fable 5.2', 'https://www.anthropic.com/claude', 'Agent model configuration', true),
  ('claude-opus-5-5-max', 'Claude Opus 5.5 (Max)', 'Anthropic', 'Claude Opus 5.5', 'https://www.anthropic.com/claude', 'Agent model configuration', true),
  ('gemini-4-neon-xhigh', 'Gemini 4 Neon (xHigh)', 'Google', 'Gemini 4', 'https://deepmind.google/models/gemini/', 'Agent model configuration', true),
  ('gemini-4-carbon-high', 'Gemini 4 Carbon (High)', 'Google', 'Gemini 4', 'https://deepmind.google/models/gemini/', 'Agent model configuration', true),
  ('claude-sonnet-5-5-max', 'Claude Sonnet 5.5 (Max)', 'Anthropic', 'Claude Sonnet 5.5', 'https://www.anthropic.com/claude', 'Agent model configuration', true),
  ('gpt-6-astra-max', 'GPT-6 Astra (Max)', 'OpenAI', 'GPT-6', 'https://openai.com/', 'Agent model configuration', true),
  ('claude-opus-5-5-high', 'Claude Opus 5.5 (High)', 'Anthropic', 'Claude Opus 5.5', 'https://www.anthropic.com/claude', 'Agent model configuration', true),
  ('gpt-6-2-astra-max', 'GPT-6.2 Astra (Max)', 'OpenAI', 'GPT-6.2', 'https://openai.com/', 'Agent model configuration', true),
  ('gemini-4-hydrogen-xhigh', 'Gemini 4 Hydrogen (xHigh)', 'Google', 'Gemini 4', 'https://deepmind.google/models/gemini/', 'Agent model configuration', true),
  ('claude-fable-5-1-max', 'Claude Fable 5.1 (Max)', 'Anthropic', 'Claude Fable 5.1', 'https://www.anthropic.com/claude', 'Agent model configuration', true),
  ('gpt-6-2-sol-max', 'GPT-6.2 Sol (Max)', 'OpenAI', 'GPT-6.2', 'https://openai.com/', 'Agent model configuration', true),
  ('gpt-6-1-sol-max', 'GPT-6.1 Sol (Max)', 'OpenAI', 'GPT-6.1', 'https://openai.com/', 'Agent model configuration', true),
  ('gpt-6-1-terra-max', 'GPT-6.1 Terra (Max)', 'OpenAI', 'GPT-6.1', 'https://openai.com/', 'Agent model configuration', true),
  ('gemini-4-argon-high', 'Gemini 4 Argon (High)', 'Google', 'Gemini 4', 'https://deepmind.google/models/gemini/', 'Agent model configuration', true),
  ('claude-sonnet-5-5-high', 'Claude Sonnet 5.5 (High)', 'Anthropic', 'Claude Sonnet 5.5', 'https://www.anthropic.com/claude', 'Agent model configuration', true)
on conflict (slug) do update set
  name=excluded.name, provider=excluded.provider, model_family=excluded.model_family,
  official_url=excluded.official_url, model_type=excluded.model_type,
  is_published=excluded.is_published, updated_at=now();

insert into public.ai_benchmarks
  (slug, name, category, description, methodology_url, leaderboard_url, higher_is_better, is_published)
values
  ('arena-agent-index-2026-11', 'Arena Agent Arena Index', 'Agentic workflows',
   'Arena index ranking for agent configurations. It is a leaderboard index, not a percentage or a direct task success rate. Compare only entries from this same snapshot and index.',
   'https://arena.ai/leaderboard', 'https://arena.ai/leaderboard', true, true)
on conflict (slug) do update set
  name=excluded.name, category=excluded.category, description=excluded.description,
  methodology_url=excluded.methodology_url, leaderboard_url=excluded.leaderboard_url,
  higher_is_better=excluded.higher_is_better, is_published=excluded.is_published, updated_at=now();

with rows(slug, score) as (values
  ('claude-fable-5-2-max',1449::numeric),
  ('claude-opus-5-5-max',1342::numeric),
  ('gemini-4-neon-xhigh',1331::numeric),
  ('gemini-4-carbon-high',1304::numeric),
  ('claude-sonnet-5-5-max',1292::numeric),
  ('gpt-6-astra-max',1284::numeric),
  ('claude-opus-5-5-high',1275::numeric),
  ('gpt-6-2-astra-max',1275::numeric),
  ('gemini-4-hydrogen-xhigh',1272::numeric),
  ('claude-fable-5-1-max',1265::numeric),
  ('gpt-6-2-sol-max',1241::numeric),
  ('gpt-6-1-sol-max',1237::numeric),
  ('gpt-6-1-terra-max',1230::numeric),
  ('gemini-4-argon-high',1229::numeric),
  ('claude-sonnet-5-5-high',1202::numeric)
),
upserted as (
  insert into public.ai_benchmark_results
    (model_id, benchmark_id, score, score_unit, evaluation_date, evaluation_version, harness, sample_size, evidence_grade, notes, is_published)
  select m.id, b.id, rows.score, 'index points', '2026-11-27'::date,
    'Arena Agent Arena Index snapshot 2026-11-27',
    'Arena public leaderboard; exact configuration as listed', null, 'aggregated',
    'Copied from Arena public leaderboard. Index points; not a percentage or direct task success rate.', true
  from rows
  join public.ai_models m on m.slug=rows.slug
  join public.ai_benchmarks b on b.slug='arena-agent-index-2026-11'
  on conflict (model_id, benchmark_id, evaluation_version, harness) do update set
    score=excluded.score, score_unit=excluded.score_unit, evaluation_date=excluded.evaluation_date,
    sample_size=excluded.sample_size, evidence_grade=excluded.evidence_grade,
    notes=excluded.notes, is_published=excluded.is_published, updated_at=now()
  returning id
)
insert into public.ai_benchmark_evidence
  (result_id, source_title, source_url, source_type, published_at, notes)
select id, 'Arena — official Agent Arena leaderboard',
  'https://arena.ai/leaderboard', 'reputable_aggregator', '2026-11-27',
  'Official Arena leaderboard snapshot checked 2026-11-27. Values are Arena index points.'
from upserted u
where not exists (
  select 1 from public.ai_benchmark_evidence e
  where e.result_id=u.id and e.source_url='https://arena.ai/leaderboard'
);
