import type { Metadata } from "next";
import { getLocale, localeUrl } from "@/lib/locale";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "en" ? "AI Rankings — Find the Best AI for Your Task" : "Рейтинги ШІ — оберіть найкращий для свого завдання",
    description: locale === "en"
      ? "Clear, task-based rankings of AI assistants, coding models, image generators and video generators, with links to the original leaderboards."
      : "Зрозумілі рейтинги ШІ для повсякденних завдань, програмування, створення зображень і відео з посиланнями на першоджерела.",
    alternates: { canonical: localeUrl(locale, "/rankings"), languages: { "uk-UA": localeUrl("uk", "/rankings"), "en-US": localeUrl("en", "/rankings") } },
    robots: { index: false, follow: true },
  };
}

type Entry = { name: string; provider: string; score: string; detail?: string };
type Ranking = {
  title: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
  updated: string;
  metric: string;
  entries: Entry[];
  caveat?: string;
};

const rankings: Ranking[] = [
  {
    title: "Overall AI capabilities",
    description: "A broad test of knowledge, reasoning, coding and practical work. It is the closest available all-round comparison, but not a universal score for every AI task.",
    sourceName: "Artificial Analysis Intelligence Index v5.0.2",
    sourceUrl: "https://artificialanalysis.ai/models",
    updated: "28 Nov 2026",
    metric: "Index score · higher is better",
    entries: [
      { name: "Claude Fable 5.2", provider: "Anthropic", score: "65", detail: "Max" },
      { name: "Claude Fable 5.2", provider: "Anthropic", score: "62", detail: "xHigh" },
      { name: "GPT-6.2 Astra", provider: "OpenAI", score: "62", detail: "Max" },
      { name: "Claude Fable 5.2", provider: "Anthropic", score: "62", detail: "High" },
      { name: "GPT-6.2 Astra", provider: "OpenAI", score: "62", detail: "xHigh" },
    ],
    caveat: "The index combines several text and practical-work evaluations. It is not a dedicated image or video test, and different settings of the same model are listed separately.",
  },
  {
    title: "Text, writing & everyday chat",
    description: "Models ranked by people's preferences in everyday conversations, explanations and writing.",
    sourceName: "Arena Text Leaderboard",
    sourceUrl: "https://arena.ai/leaderboard/chat/text",
    updated: "22 Nov 2026",
    metric: "Arena rating · higher is better",
    entries: [
      { name: "Gemini 4 Carbon", provider: "Google", score: "1,527", detail: "High" },
      { name: "Gemini 4 Argon", provider: "Google", score: "—", detail: "Rank 2 · High" },
      { name: "Gemini 4 Neon", provider: "Google", score: "—", detail: "Rank 3 · xHigh" },
      { name: "Muse Wonder", provider: "Meta", score: "—", detail: "Rank 4 · Max" },
      { name: "Claude Opus 5.5", provider: "Anthropic", score: "—", detail: "Rank 5 · High" },
    ],
    caveat: "Arena's current page exposes the exact rating for the leader and the ordered top five. Unpublished ratings are shown as a dash rather than estimated.",
  },
  {
    title: "Programming & coding",
    description: "Models compared on real-world coding prompts, especially building and editing web apps.",
    sourceName: "Arena Code / WebDev Leaderboard",
    sourceUrl: "https://arena.ai/leaderboard/code/webdev",
    updated: "22 Nov 2026",
    metric: "Arena rating · higher is better",
    entries: [
      { name: "Claude Fable 5.2", provider: "Anthropic", score: "1,822", detail: "xHigh" },
      { name: "Claude Opus 5.5", provider: "Anthropic", score: "1,820", detail: "Max" },
      { name: "Claude Sonnet 5.5", provider: "Anthropic", score: "1,772", detail: "xHigh" },
      { name: "Gemini 4 Carbon", provider: "Google", score: "1,769", detail: "High" },
      { name: "Gemini 4 Neon", provider: "Google", score: "—", detail: "Rank 5 · High" },
    ],
    caveat: "This is a practical web-app building comparison, not a complete test of every programming language. The source page does not expose the fifth model's exact rating in its summary.",
  },
  {
    title: "Image generation",
    description: "Models ranked by human preference when generating an image from the same text prompt.",
    sourceName: "Artificial Analysis Image Arena v2.1",
    sourceUrl: "https://artificialanalysis.ai/image/leaderboard/text-to-image",
    updated: "28 Nov 2026",
    metric: "Elo rating · higher is better",
    entries: [
      { name: "GPT Image 2.5", provider: "OpenAI", score: "1,223", detail: "Sunburst · Max" },
      { name: "GPT Image 2.5", provider: "OpenAI", score: "1,207", detail: "Flare · Max" },
      { name: "GPT Image 2", provider: "OpenAI", score: "1,189", detail: "High" },
      { name: "Nano Banana 2.1", provider: "Google", score: "1,176" },
      { name: "Grok Imagine Image 2.0", provider: "xAI", score: "1,168" },
    ],
    caveat: "This list is for creating an image from a text prompt. Editing an existing image is measured separately.",
  },
  {
    title: "Video generation",
    description: "Models ranked by human preference when generating a video with audio from a text prompt.",
    sourceName: "Artificial Analysis Video Arena v2.1",
    sourceUrl: "https://artificialanalysis.ai/video/leaderboard/text-to-video",
    updated: "28 Nov 2026",
    metric: "Elo rating · higher is better",
    entries: [
      { name: "Wan 3.0", provider: "Alibaba", score: "1,175" },
      { name: "Utopai X", provider: "Utopai Studios", score: "1,173" },
      { name: "MiniMax H3", provider: "MiniMax", score: "1,164", detail: "768p" },
      { name: "Hyperflow H3", provider: "Video Rebirth", score: "1,156" },
      { name: "Dreamina Seedance 2.5", provider: "ByteDance", score: "1,154" },
    ],
    caveat: "This leaderboard measures text-to-video generation with audio. Image-to-video has a separate ranking.",
  },
];

export default async function RankingsPage() {
  const locale = await getLocale();
  const en = locale === "en";
  const labels = en ? {
    kicker: "AI, MADE COMPARABLE",
    title: "Find the right AI for the job",
    intro: "Five simple rankings for the tasks people actually use AI for. Each list comes from a specialist public leaderboard — scores from different lists are not compared with each other.",
    how: "How to read this page",
    howText: "Choose the task you care about. The source, date and scoring method are shown for every list. A dash means the source showed a rank but did not expose a score in the captured result.",
    rank: "Rank",
    model: "AI model",
    company: "Developer",
    score: "Score",
    details: "Settings",
    source: "Open original leaderboard",
    updated: "Source checked",
    note: "Important note",
    overallNote: "There is no reliable single score that combines chat, coding, image generation and video generation into one multimodal winner. The first list is a broad capability benchmark, while images and video are ranked separately.",
    footer: "Rankings are snapshots, not permanent winners. Model releases and leaderboard positions change, so always check the original source for the latest result.",
  } : {
    kicker: "ШІ — ЗРОЗУМІЛО І ПОРІВНЮВАНО",
    title: "Обери ШІ для свого завдання",
    intro: "П’ять простих рейтингів для завдань, заради яких люди найчастіше користуються ШІ. Кожен список узято з профільного відкритого рейтингу — бали з різних списків не порівнюються між собою.",
    how: "Як читати цю сторінку",
    howText: "Обери потрібне завдання. Для кожного списку вказано джерело, дату й спосіб оцінювання. Тире означає, що джерело показало місце моделі, але не відкрило її бал у доступному результаті.",
    rank: "Місце",
    model: "Модель ШІ",
    company: "Розробник",
    score: "Бал",
    details: "Налаштування",
    source: "Відкрити оригінальний рейтинг",
    updated: "Джерело перевірено",
    note: "Важливо",
    overallNote: "Немає надійного єдиного бала, який об’єднує чат, програмування, створення зображень і відео та визначає одного мультимодального переможця. Перший список — це широкий тест можливостей, а зображення й відео оцінюються окремо.",
    footer: "Рейтинги — це зріз на конкретну дату, а не вічні переможці. Моделі й позиції змінюються, тому для найновіших результатів перевіряй першоджерело.",
  };

  return (
    <main className="ranking-page page-shell ranking-simple">
      <header className="ranking-hero">
        <div className="section-kicker">{labels.kicker}</div>
        <h1>{labels.title}<span>.</span></h1>
        <p>{labels.intro}</p>
      </header>

      <section className="ranking-principles" aria-labelledby="ranking-how-title">
        <h2 id="ranking-how-title">{labels.how}</h2>
        <p>{labels.howText}</p>
      </section>

      <div className="ranking-simple-list">
        {rankings.map((ranking, index) => (
          <section className="ranking-simple-card" key={ranking.title}>
            <div className="ranking-simple-heading">
              <div>
                <span className="ranking-category">{en ? `RANKING 0${index + 1}` : `РЕЙТИНГ 0${index + 1}`}</span>
                <h2>{en ? ranking.title : [
                  "Загальні можливості ШІ",
                  "Текст, написання та спілкування",
                  "Програмування та код",
                  "Створення зображень",
                  "Створення відео",
                ][index]}</h2>
                <p>{en ? ranking.description : [
                  "Широке порівняння логіки, знань, програмування та повсякденних робочих завдань.",
                  "Який ШІ дає людям найкращі відповіді у звичайних розмовах, поясненнях і написанні текстів.",
                  "Порівняння моделей на практичних завданнях із програмування, зокрема створенні вебзастосунків.",
                  "Які моделі створюють найкращі зображення за однаковим текстовим запитом.",
                  "Які моделі створюють найкращі відео за текстовим запитом.",
                ][index]}</p>
              </div>
              <div className="ranking-simple-meta">
                <span>{ranking.metric}</span>
                <small>{labels.updated}: {ranking.updated}</small>
              </div>
            </div>
            <div className="ranking-simple-table-wrap">
              <table className="ranking-simple-table">
                <thead><tr><th>{labels.rank}</th><th>{labels.model}</th><th>{labels.company}</th><th>{labels.score}</th><th>{labels.details}</th></tr></thead>
                <tbody>
                  {ranking.entries.map((entry, rowIndex) => (
                    <tr key={entry.name + (entry.detail ?? "")}>
                      <td className="ranking-simple-position">{rowIndex + 1}</td>
                      <td className="ranking-simple-model">{entry.name}</td>
                      <td>{entry.provider}</td>
                      <td className="ranking-simple-score">{entry.score}</td>
                      <td>{entry.detail ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {ranking.caveat && <p className="ranking-simple-caveat"><strong>{labels.note}:</strong> {ranking.caveat}</p>}
            <div className="ranking-simple-source">
              <a href={ranking.sourceUrl} target="_blank" rel="noreferrer">{labels.source} ↗</a>
              <span>{ranking.sourceName}</span>
            </div>
          </section>
        ))}
      </div>

      <section className="ranking-methodology ranking-simple-methodology">
        <h2>{labels.note}</h2>
        <p>{labels.overallNote} {labels.footer}</p>
      </section>
    </main>
  );
}
