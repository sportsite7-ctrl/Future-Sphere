-- Curated model directory and first provider-reported benchmark records.
-- Model metadata is linked to official provider pages. Scores below are explicitly
-- provider-reported and are not presented as independently verified.

insert into public.ai_models
  (slug, name, provider, model_family, release_date, official_url, model_type, is_published)
values
  ('gpt-6-2-astra', 'GPT-6.2 Astra', 'OpenAI', 'GPT-6', '2026-11-17', 'https://developers.openai.com/api/docs/changelog', 'Frontier reasoning and coding', true),
  ('gpt-6-2-sol', 'GPT-6.2 Sol', 'OpenAI', 'GPT-6', '2026-11-17', 'https://developers.openai.com/api/docs/changelog', 'General-purpose coding and agent workflows', true),
  ('claude-fable-5-2', 'Claude Fable 5.2', 'Anthropic', 'Claude Fable', '2026-11-09', 'https://www.anthropic.com/claude/fable', 'Frontier technical work and coding', true),
  ('gemini-4-carbon', 'Gemini 4 Carbon', 'Google DeepMind', 'Gemini 4', '2026-11-10', 'https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/', 'Multimodal reasoning and agentic workflows', true),
  ('deepseek-v4-1-flash', 'DeepSeek-V4.1-Flash', 'DeepSeek', 'DeepSeek V4', '2026-09-10', 'https://deepseek.com/en/news/deepseek-v4-1-flash/', 'Multimodal reasoning model', true),
  ('mistral-large-4', 'Mistral Large 4', 'Mistral AI', 'Mistral Large', '2026-10-06', 'https://mistral.ai/news/mistral-large-4/', 'Multimodal open-weight model', true),
  ('muse-wonder', 'Muse Wonder', 'Meta', 'Muse Wonder', '2026-10-12', 'https://about.fb.com/news/2026/10/introducing-muse-wonder-models/', 'Agentic frontier model', true),
  ('qwen4-max', 'Qwen4-Max', 'Alibaba Cloud', 'Qwen4', '2026-11-16', 'https://qwen.ai/blog/qwen4-max', 'Multimodal reasoning model', true)
on conflict (slug) do update set
  name = excluded.name,
  provider = excluded.provider,
  model_family = excluded.model_family,
  release_date = excluded.release_date,
  official_url = excluded.official_url,
  model_type = excluded.model_type,
  is_published = excluded.is_published,
  updated_at = now();

insert into public.ai_benchmarks
  (slug, name, category, description, methodology_url, leaderboard_url, higher_is_better, is_published)
values
  ('gpqa-diamond', 'GPQA Diamond', 'Graduate-level science', 'A difficult graduate-level science question set. The score below is reported by the model provider; evaluation details and sample count were not specified in the cited release note.', 'https://arxiv.org/abs/2311.12022', 'https://arxiv.org/abs/2311.12022', true, true),
  ('hle-text', 'Humanity’s Last Exam (text subset)', 'Expert-level knowledge', 'An expert-level benchmark. This record is explicitly for the pure-text subset as described by the provider; it must not be confused with tool-assisted HLE results.', 'https://arxiv.org/abs/2501.14249', 'https://lastexam.ai/', true, true),
  ('codeforces-rating', 'Codeforces Rating', 'Competitive programming', 'Competitive-programming rating reported by the provider. Rating methodology and evaluation protocol are not fully specified in the cited release note.', 'https://codeforces.com/blog/entry/20762', 'https://codeforces.com/', true, true),
  ('matharena-apex', 'MathArena Apex', 'Mathematics', 'A mathematics evaluation reported by the provider. The cited release note does not disclose the exact evaluation harness or sample size.', 'https://matharena.ai/', 'https://matharena.ai/', true, true),
  ('terminal-bench-2-1', 'Terminal-Bench 2.1', 'Terminal and agentic coding', 'A terminal-based agent benchmark. This provider-reported result is kept separate from other Terminal-Bench versions and harnesses.', 'https://www.tbench.ai/', 'https://www.tbench.ai/', true, true)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  methodology_url = excluded.methodology_url,
  leaderboard_url = excluded.leaderboard_url,
  higher_is_better = excluded.higher_is_better,
  is_published = excluded.is_published,
  updated_at = now();

with score_rows(slug, benchmark_slug, score, unit, note) as (
  values
    ('deepseek-v4-1-flash', 'gpqa-diamond', 90.9::numeric, '%', 'Provider-reported in DeepSeek release note. Evaluation harness and sample size not disclosed in that note.'),
    ('deepseek-v4-1-flash', 'hle-text', 36.8::numeric, '%', 'Provider-reported pure-text subset only. Do not compare with tool-assisted HLE results. Evaluation harness and sample size not disclosed in that note.'),
    ('deepseek-v4-1-flash', 'codeforces-rating', 3471::numeric, 'rating', 'Provider-reported rating. Evaluation protocol and sample size not disclosed in that note.'),
    ('deepseek-v4-1-flash', 'matharena-apex', 65.6::numeric, '%', 'Provider-reported. Evaluation harness and sample size not disclosed in that note.'),
    ('deepseek-v4-1-flash', 'terminal-bench-2-1', 90.6::numeric, '%', 'Provider-reported Terminal-Bench 2.1 result. Evaluation harness and sample size not disclosed in that note.')
),
upserted as (
  insert into public.ai_benchmark_results
    (model_id, benchmark_id, score, score_unit, evaluation_date, evaluation_version, harness, sample_size, evidence_grade, notes, is_published)
  select m.id, b.id, s.score, s.unit, '2026-09-10'::date,
    'Provider release report 2026-09-10; benchmark protocol not specified',
    'Provider-reported; harness details not disclosed', null, 'provider_reported', s.note, true
  from score_rows s
  join public.ai_models m on m.slug = s.slug
  join public.ai_benchmarks b on b.slug = s.benchmark_slug
  on conflict (model_id, benchmark_id, evaluation_version, harness) do update set
    score = excluded.score,
    score_unit = excluded.score_unit,
    evaluation_date = excluded.evaluation_date,
    sample_size = excluded.sample_size,
    evidence_grade = excluded.evidence_grade,
    notes = excluded.notes,
    is_published = excluded.is_published,
    updated_at = now()
  returning id
)
insert into public.ai_benchmark_evidence (result_id, source_title, source_url, source_type, published_at, notes)
select r.id, 'Introducing DeepSeek-V4.1-Flash', 'https://deepseek.com/en/news/deepseek-v4-1-flash/', 'model_provider', '2026-09-10',
  'Primary-source release note. These are provider claims, not an independent reproduction.'
from upserted r
where not exists (
  select 1 from public.ai_benchmark_evidence e
  where e.result_id = r.id
    and e.source_url = 'https://deepseek.com/en/news/deepseek-v4-1-flash/'
);
