-- Expand the model directory beyond DeepSeek.
-- Model names are taken from the official Arena Text leaderboard snapshot (2026-11-22).
-- Directory entries do not imply a benchmark score; only sourced result rows appear in rankings.

insert into public.ai_models
  (slug, name, provider, model_family, release_date, official_url, model_type, is_published)
values
  ('gemini-4-carbon-high', 'Gemini 4 Carbon (High)', 'Google', 'Gemini 4', null, 'https://deepmind.google/models/gemini/', 'General-purpose multimodal model', true),
  ('gemini-4-argon-high', 'Gemini 4 Argon (High)', 'Google', 'Gemini 4', null, 'https://deepmind.google/models/gemini/', 'General-purpose multimodal model', true),
  ('gemini-4-neon-high', 'Gemini 4 Neon (High)', 'Google', 'Gemini 4', null, 'https://deepmind.google/models/gemini/', 'General-purpose multimodal model', true),
  ('gemini-4-hydrogen-xhigh', 'Gemini 4 Hydrogen (xHigh)', 'Google', 'Gemini 4', null, 'https://deepmind.google/models/gemini/', 'General-purpose multimodal model', true),
  ('claude-opus-5-5-high', 'Claude Opus 5.5 (High)', 'Anthropic', 'Claude 5', null, 'https://www.anthropic.com/claude', 'General-purpose reasoning model', true),
  ('claude-fable-5-1-max', 'Claude Fable 5.1 (Max)', 'Anthropic', 'Claude 5', null, 'https://www.anthropic.com/claude', 'General-purpose reasoning model', true),
  ('claude-opus-5-max', 'Claude Opus 5 (Max)', 'Anthropic', 'Claude 5', null, 'https://www.anthropic.com/claude', 'General-purpose reasoning model', true),
  ('claude-opus-4-6-high', 'Claude Opus 4.6 (High)', 'Anthropic', 'Claude 4', null, 'https://www.anthropic.com/claude', 'General-purpose reasoning model', true),
  ('muse-wonder-max', 'Muse Wonder (Max)', 'Meta', 'Muse', null, 'https://ai.meta.com/', 'General-purpose AI model', true),
  ('muse-spark-1-3-max', 'Muse Spark 1.3 (Max)', 'Meta', 'Muse Spark', null, 'https://ai.meta.com/', 'General-purpose AI model', true),
  ('mimo-v2-6-pro', 'MiMo-V2.6-Pro', 'Xiaomi', 'MiMo V2.6', null, 'https://www.mi.com/global/', 'General-purpose AI model', true),
  ('qwen-3-8-max', 'Qwen3.8-Max', 'Alibaba', 'Qwen 3.8', null, 'https://qwen.ai/', 'General-purpose language model', true),
  ('gpt-6-2-astra-max', 'GPT-6.2 Astra (Max)', 'OpenAI', 'GPT-6.2', null, 'https://openai.com/', 'General-purpose reasoning model', true),
  ('gpt-6-2-sol-max', 'GPT-6.2 Sol (Max)', 'OpenAI', 'GPT-6.2', null, 'https://openai.com/', 'General-purpose reasoning model', true),
  ('deepseek-v4-flash', 'DeepSeek-V4-Flash', 'DeepSeek', 'DeepSeek V4', null, 'https://www.deepseek.com/', 'General-purpose language model', true)
on conflict (slug) do update set
  name = excluded.name,
  provider = excluded.provider,
  model_family = excluded.model_family,
  official_url = excluded.official_url,
  model_type = excluded.model_type,
  is_published = excluded.is_published,
  updated_at = now();
