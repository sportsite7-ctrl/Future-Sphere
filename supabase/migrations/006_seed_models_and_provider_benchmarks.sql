-- Curated AI model directory and provider-reported benchmark results.
-- Scores below are transcribed from the model provider's official release note.
-- They are NOT independent reproductions. Missing evaluation details stay explicitly unknown.

insert into public.ai_models
  (slug, name, provider, model_family, release_date, official_url, model_type, is_published)
values
  ('deepseek-v4-1-flash', 'DeepSeek-V4.1-Flash', 'DeepSeek', 'DeepSeek V4', '2026-09-10',
   'https://api-docs.deepseek.com/updates/', 'Multimodal reasoning model', true)
on conflict (slug) do update set
  name = excluded.name, provider = excluded.provider, model_family = excluded.model_family,
  release_date = excluded.release_date, official_url = excluded.official_url,
  model_type = excluded.model_type, is_published = excluded.is_published, updated_at = now();

insert into public.ai_benchmarks
  (slug, name, category, description, methodology_url, leaderboard_url, higher_is_better, is_published)
values
  ('gpqa-diamond', 'GPQA Diamond', 'Graduate-level science',
   'Graduate-level science questions. This entry is a score reported by DeepSeek; it has not been independently reproduced here.',
   'https://arxiv.org/abs/2311.12022', 'https://arxiv.org/abs/2311.12022', true, true),
  ('hle', 'Humanity’s Last Exam (HLE)', 'Expert-level knowledge',
   'Expert-level benchmark. The provider release separately reports the general result, a pure-text subset result and a tool-assisted result; these are kept as distinct entries.',
   'https://arxiv.org/abs/2501.14249', 'https://lastexam.ai/', true, true),
  ('codeforces-rating', 'Codeforces Rating', 'Competitive programming',
   'Competitive-programming rating reported by DeepSeek. This is a rating, not a percentage.',
   'https://codeforces.com/blog/entry/20762', 'https://codeforces.com/', true, true),
  ('matharena-apex', 'MathArena Apex', 'Mathematics',
   'MathArena Apex result reported by DeepSeek. Evaluation setup details are not fully specified in the cited release note.',
   'https://matharena.ai/', 'https://matharena.ai/', true, true),
  ('terminal-bench-2-1', 'Terminal-Bench 2.1', 'Terminal and agentic coding',
   'Terminal-Bench 2.1 score reported by DeepSeek. Kept separate from later Terminal-Bench releases.',
   'https://www.tbench.ai/', 'https://www.tbench.ai/', true, true),
  ('terminal-bench-3-0', 'Terminal-Bench 3.0', 'Terminal and agentic coding',
   'Terminal-Bench 3.0 score reported by DeepSeek. Not comparable with scores from other Terminal-Bench versions.',
   'https://www.tbench.ai/', 'https://www.tbench.ai/', true, true),
  ('terminal-bench-4-0', 'Terminal-Bench 4.0', 'Terminal and agentic coding',
   'Terminal-Bench 4.0 score reported by DeepSeek. Not comparable with scores from other Terminal-Bench versions.',
   'https://www.tbench.ai/', 'https://www.tbench.ai/', true, true),
  ('deepswe-v1-1', 'DeepSWE v1.1', 'Software engineering',
   'Resolved-task score reported by DeepSeek. The provider release note does not give full run details.',
   'https://github.com/DeepSeek', 'https://github.com/DeepSeek', true, true),
  ('programbench', 'ProgramBench', 'Programming',
   'Almost@1 metric reported by DeepSeek. Preserve the metric label; do not interpret it as a generic percentage.',
   'https://api-docs.deepseek.com/updates/', 'https://api-docs.deepseek.com/updates/', true, true),
  ('nl2repo-bench', 'NL2Repo-Bench', 'Repository-level coding',
   'Score reported by DeepSeek. Full harness details are not present in the cited release note.',
   'https://api-docs.deepseek.com/updates/', 'https://api-docs.deepseek.com/updates/', true, true),
  ('cybergym', 'CyberGym', 'Cybersecurity research benchmark',
   'Pass@1 score reported by DeepSeek. This is benchmark metadata only; no operational security guidance is provided.',
   'https://github.com/QiushiWu/CyberGym', 'https://github.com/QiushiWu/CyberGym', true, true),
  ('sec-bench-pro', 'SEC-Bench Pro', 'Security evaluation',
   'Pass@1 score reported by DeepSeek. Provider-reported result; evaluation configuration is not fully detailed in the release note.',
   'https://api-docs.deepseek.com/updates/', 'https://api-docs.deepseek.com/updates/', true, true),
  ('exploitgym', 'ExploitGym', 'Security evaluation',
   'Pass@1 score reported by DeepSeek. Provider-reported result; not an independently verified assessment.',
   'https://api-docs.deepseek.com/updates/', 'https://api-docs.deepseek.com/updates/', true, true),
  ('automation-bench', 'Automation-Bench', 'Agentic workflows',
   'Pass@1 score reported by DeepSeek. Benchmark setup details are not fully specified in the cited release note.',
   'https://api-docs.deepseek.com/updates/', 'https://api-docs.deepseek.com/updates/', true, true),
  ('agents-last-exam', 'Agents’ Last Exam', 'Agentic workflows',
   'Pass@1 score reported by DeepSeek.',
   'https://api-docs.deepseek.com/updates/', 'https://api-docs.deepseek.com/updates/', true, true),
  ('chartography', 'Chartography (with tools)', 'Multimodal and visual reasoning',
   'Tool-assisted score reported by DeepSeek. Kept distinct from non-tool-assisted evaluations.',
   'https://api-docs.deepseek.com/updates/', 'https://api-docs.deepseek.com/updates/', true, true),
  ('babyvision', 'BabyVision (with tools)', 'Visual reasoning',
   'Tool-assisted score reported by DeepSeek.',
   'https://api-docs.deepseek.com/updates/', 'https://api-docs.deepseek.com/updates/', true, true),
  ('zerobench-main', 'ZeroBench-main (with tools)', 'Visual reasoning',
   'Pass@5 score reported by DeepSeek. The Pass@5 metric is retained and must not be compared with Pass@1 results.',
   'https://api-docs.deepseek.com/updates/', 'https://api-docs.deepseek.com/updates/', true, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, description = excluded.description,
  methodology_url = excluded.methodology_url, leaderboard_url = excluded.leaderboard_url,
  higher_is_better = excluded.higher_is_better, is_published = excluded.is_published,
  updated_at = now();

with score_rows(slug, benchmark_slug, score, unit, metric, note) as (
  values
    ('deepseek-v4-1-flash', 'gpqa-diamond', 90.9::numeric, '%', 'Pass@1',
     'DeepSeek-reported. Release note does not disclose the full evaluation harness or sample size.'),
    ('deepseek-v4-1-flash', 'hle', 36.8::numeric, '%', 'Pass@1',
     'General HLE result as reported by DeepSeek. The separately reported pure-text subset and tool-assisted score are not conflated with this result.'),
    ('deepseek-v4-1-flash', 'hle', 39.1::numeric, '%', 'Pass@1 — pure-text subset',
     'DeepSeek marks this as tested only on the pure-text subset of HLE. Distinct from the general HLE result.'),
    ('deepseek-v4-1-flash', 'hle', 63.9::numeric, '%', 'Pass@1 — with tools',
     'Tool-assisted HLE result reported by DeepSeek; not directly comparable with the non-tool HLE score.'),
    ('deepseek-v4-1-flash', 'codeforces-rating', 3471::numeric, 'rating', 'Rating',
     'Provider-reported Codeforces rating. Not a percentage.'),
    ('deepseek-v4-1-flash', 'matharena-apex', 65.6::numeric, '%', 'Pass@1',
     'DeepSeek-reported. Full evaluation configuration is not included in the cited release note.'),
    ('deepseek-v4-1-flash', 'terminal-bench-2-1', 90.6::numeric, '%', 'Pass@1',
     'DeepSeek-reported Terminal-Bench 2.1 result.'),
    ('deepseek-v4-1-flash', 'terminal-bench-3-0', 30.0::numeric, '%', 'Pass@1',
     'DeepSeek-reported Terminal-Bench 3.0 result. Do not compare across benchmark versions.'),
    ('deepseek-v4-1-flash', 'terminal-bench-4-0', 31.2::numeric, '%', 'Pass@1',
     'DeepSeek-reported Terminal-Bench 4.0 result. Do not compare across benchmark versions.'),
    ('deepseek-v4-1-flash', 'deepswe-v1-1', 74.2::numeric, '%', 'Resolved',
     'DeepSeek-reported resolved-task score.'),
    ('deepseek-v4-1-flash', 'programbench', 20.3::numeric, 'score', 'Almost@1',
     'DeepSeek-reported metric. The metric name is preserved as supplied.'),
    ('deepseek-v4-1-flash', 'nl2repo-bench', 65.4::numeric, 'score', 'Score',
     'DeepSeek-reported metric.'),
    ('deepseek-v4-1-flash', 'cybergym', 88.1::numeric, '%', 'Pass@1',
     'DeepSeek-reported. Not independently reproduced here.'),
    ('deepseek-v4-1-flash', 'sec-bench-pro', 62.8::numeric, '%', 'Pass@1',
     'DeepSeek-reported. Not independently reproduced here.'),
    ('deepseek-v4-1-flash', 'exploitgym', 15.3::numeric, '%', 'Pass@1',
     'DeepSeek-reported. Not independently reproduced here.'),
    ('deepseek-v4-1-flash', 'automation-bench', 54.8::numeric, '%', 'Pass@1',
     'DeepSeek-reported.'),
    ('deepseek-v4-1-flash', 'agents-last-exam', 31.8::numeric, '%', 'Pass@1',
     'DeepSeek-reported.'),
    ('deepseek-v4-1-flash', 'chartography', 78.9::numeric, '%', 'Pass@1 — with tools',
     'Tool-assisted result reported by DeepSeek.'),
    ('deepseek-v4-1-flash', 'babyvision', 89.6::numeric, '%', 'Pass@1 — with tools',
     'Tool-assisted result reported by DeepSeek.'),
    ('deepseek-v4-1-flash', 'zerobench-main', 49.0::numeric, 'score', 'Pass@5 — with tools',
     'Pass@5 tool-assisted result reported by DeepSeek; not directly comparable with Pass@1.')
),
upserted as (
  insert into public.ai_benchmark_results
    (model_id, benchmark_id, score, score_unit, evaluation_date, evaluation_version, harness, sample_size, evidence_grade, notes, is_published)
  select m.id, b.id, s.score, s.unit, '2026-09-10'::date,
    'DeepSeek release note 2026-09-10; ' || s.metric,
    'Provider-reported; full harness details not disclosed', null, 'provider_reported', s.note, true
  from score_rows s
  join public.ai_models m on m.slug = s.slug
  join public.ai_benchmarks b on b.slug = s.benchmark_slug
  on conflict (model_id, benchmark_id, evaluation_version, harness) do update set
    score = excluded.score, score_unit = excluded.score_unit,
    evaluation_date = excluded.evaluation_date, sample_size = excluded.sample_size,
    evidence_grade = excluded.evidence_grade, notes = excluded.notes,
    is_published = excluded.is_published, updated_at = now()
  returning id
)
insert into public.ai_benchmark_evidence
  (result_id, source_title, source_url, source_type, published_at, notes)
select r.id, 'DeepSeek API Docs — September 10, 2026 release note',
  'https://api-docs.deepseek.com/updates/', 'model_provider', '2026-09-10',
  'Primary-source provider report. These figures are attributed to DeepSeek and are not represented as independent measurements.'
from upserted r
where not exists (
  select 1 from public.ai_benchmark_evidence e
  where e.result_id = r.id and e.source_url = 'https://api-docs.deepseek.com/updates/'
);
