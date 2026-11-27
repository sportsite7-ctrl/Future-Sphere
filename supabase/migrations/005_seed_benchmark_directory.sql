-- Curated benchmark directory. Metadata only: no model scores are inserted here.
-- All score rows must be added only after checking the live official source.

insert into public.ai_benchmarks
  (slug, name, category, description, methodology_url, leaderboard_url, higher_is_better, is_published)
values
  (
    'arena-text',
    'Arena Text Leaderboard',
    'Human preference',
    'Anonymous head-to-head comparisons voted on by people. This measures user preference for conversational responses, not objective correctness on every task.',
    'https://arena.ai/blog/ranking-method',
    'https://arena.ai/leaderboard?arena=text',
    true,
    true
  ),
  (
    'livebench-2',
    'LiveBench 2.0',
    'Reasoning, coding and agentic tasks',
    'A regularly refreshed benchmark with task suites and objective grading. Always record the exact release and suite; scores from different releases must not be mixed.',
    'https://livebench.ai/',
    'https://livebench.ai/',
    true,
    true
  ),
  (
    'artificial-analysis-index',
    'Artificial Analysis Intelligence Index',
    'Composite capability index',
    'An independently run weighted index across knowledge work, coding, science and general knowledge. It is primarily text-based and English-language; consult the current methodology version before comparing results.',
    'https://artificialanalysis.ai/methodology/intelligence-benchmarking',
    'https://artificialanalysis.ai/models',
    true,
    true
  ),
  (
    'swe-bench-verified',
    'SWE-bench Verified',
    'Software engineering',
    'A benchmark of real GitHub issue fixes. Interpret scores cautiously: outcomes depend on scaffold and evaluation setup, and independent reviews have identified contamination and test-validity concerns.',
    'https://www.swebench.com/verified.html',
    'https://www.swebench.com/verified.html',
    true,
    true
  )
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  methodology_url = excluded.methodology_url,
  leaderboard_url = excluded.leaderboard_url,
  higher_is_better = excluded.higher_is_better,
  is_published = excluded.is_published,
  updated_at = now();
