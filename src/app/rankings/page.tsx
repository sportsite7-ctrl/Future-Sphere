import type { Metadata } from "next";
import { getLocale } from "@/lib/locale";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "en" ? "AI Model Rankings" : "Рейтинги AI-моделей",
    description: locale === "en"
      ? "Evidence-backed AI model benchmark results, with methodology, evaluation setup and original sources."
      : "Результати тестування AI-моделей із методологією, умовами оцінювання та посиланнями на першоджерела.",
  };
}

type Row = Record<string, any>;

export default async function RankingsPage() {
  const locale = await getLocale();
  const en = locale === "en";
  let models: Row[] = [];
  let benchmarks: Row[] = [];
  let results: Row[] = [];
  let evidence: Row[] = [];
  let unavailable = false;

  const [modelsQuery, benchmarksQuery, resultsQuery] = await Promise.all([
    supabase.from("ai_models").select("id,slug,name,provider,model_family,release_date,official_url,model_type").eq("is_published", true),
    supabase.from("ai_benchmarks").select("id,slug,name,category,description,methodology_url,leaderboard_url,higher_is_better").eq("is_published", true),
    supabase.from("ai_benchmark_results").select("id,model_id,benchmark_id,score,score_unit,evaluation_date,evaluation_version,harness,sample_size,evidence_grade,notes").eq("is_published", true).order("evaluation_date", { ascending: false }),
  ]);

  if (modelsQuery.error || benchmarksQuery.error || resultsQuery.error) {
    unavailable = true;
  } else {
    models = (modelsQuery.data ?? []) as Row[];
    benchmarks = (benchmarksQuery.data ?? []) as Row[];
    results = (resultsQuery.data ?? []) as Row[];
    if (results.length) {
      const evidenceQuery = await supabase.from("ai_benchmark_evidence")
        .select("id,result_id,source_title,source_url,source_type,published_at,checked_at,notes")
        .in("result_id", results.map((row) => row.id));
      if (evidenceQuery.error) unavailable = true;
      else evidence = (evidenceQuery.data ?? []) as Row[];
    }
  }

  const modelById = new Map(models.map((row) => [row.id, row]));
  const benchmarkById = new Map(benchmarks.map((row) => [row.id, row]));
  const evidenceByResult = new Map<string, Row[]>();
  for (const item of evidence) {
    evidenceByResult.set(item.result_id, [...(evidenceByResult.get(item.result_id) ?? []), item]);
  }

  // Results are grouped by the exact benchmark, version and harness.
  // Scores from different setups are deliberately never compared.
  const groups = new Map<string, { benchmark: Row; version: string; harness: string; rows: Row[] }>();
  for (const result of results) {
    const model = modelById.get(result.model_id);
    const benchmark = benchmarkById.get(result.benchmark_id);
    const sources = evidenceByResult.get(result.id) ?? [];
    if (!model || !benchmark || sources.length === 0) continue;
    const key = [result.benchmark_id, result.evaluation_version, result.harness].join("::");
    const group: { benchmark: Row; version: string; harness: string; rows: Row[] } = groups.get(key) ?? {
      benchmark,
      version: result.evaluation_version,
      harness: result.harness,
      rows: [],
    };
    group.rows.push({ ...result, model, sources });
    groups.set(key, group);
  }

  const sortedGroups = [...groups.values()].map((group) => ({
    ...group,
    rows: group.rows.sort((a, b) => {
      const delta = Number(a.score) - Number(b.score);
      return group.benchmark.higher_is_better ? -delta : delta;
    }),
  }));

  const text = en ? {
    kicker: "TRANSPARENT BENCHMARKS",
    title: "AI model rankings",
    intro: "A benchmark score is meaningful only with its test, version and evaluation setup. We show the evidence behind every published result.",
    ruleTitle: "How to read these rankings",
    rule1: "Only results with a traceable source are eligible for publication.",
    rule2: "Different benchmarks, versions and evaluation harnesses are shown separately — never blended into one invented score.",
    rule3: "Provider-reported and independently measured results are clearly distinguished.",
    empty: "No sourced benchmark results have been published yet.",
    emptyHint: "We are building the evidence base first. We will not fill this page with guessed scores or unsourced model rankings.",
    unavailable: "The rankings database is not ready yet. The database migration must be applied before results can be displayed.",
    methodology: "Methodology and evidence",
    result: "Result",
    model: "Model",
    source: "Evidence",
    date: "Evaluation date",
    sample: "Samples",
    independent: "Independently measured",
    provider_reported: "Reported by provider",
    aggregated: "Leaderboard / aggregator",
    noSample: "Not disclosed",
    benchmarkSource: "Benchmark methodology",
    checked: "Source checked",
    directoryTitle: "Benchmarks we track",
    modelsTitle: "Model directory",
    modelsText: "Models are listed only when we can point to an official provider page. A listing is not an endorsement or an overall quality ranking.",
    providerNote: "Provider-reported data",
    directoryText: "These are separate evaluation systems, not one combined ranking. Open each source to inspect its current release and methodology.",
    caution: "Important caveat",
  } : {
    kicker: "ПРОЗОРІ БЕНЧМАРКИ",
    title: "Рейтинги AI-моделей",
    intro: "Результат тесту має сенс лише разом із назвою тесту, його версією та умовами оцінювання. Ми показуємо джерела кожного опублікованого результату.",
    ruleTitle: "Як читати ці рейтинги",
    rule1: "Публікуємо лише результати з перевірюваним джерелом.",
    rule2: "Різні бенчмарки, версії та умови тестування показуємо окремо — без вигаданого загального бала.",
    rule3: "Результати незалежних тестів і заяви самих розробників чітко розрізняємо.",
    empty: "Поки що немає опублікованих результатів із підтвердженими джерелами.",
    emptyHint: "Спочатку формуємо доказову базу. Не будемо заповнювати сторінку здогадками або рейтингами без першоджерел.",
    unavailable: "База рейтингів ще не готова. Щоб показувати результати, потрібно застосувати міграцію бази даних.",
    methodology: "Методологія та джерела",
    result: "Результат",
    model: "Модель",
    source: "Докази",
    date: "Дата тесту",
    sample: "Вибірка",
    independent: "Незалежне тестування",
    provider_reported: "Заявлено розробником",
    aggregated: "Лідерборд / агрегатор",
    noSample: "Не вказано",
    benchmarkSource: "Методологія тесту",
    checked: "Джерело перевірено",
    directoryTitle: "Бенчмарки, за якими ми стежимо",
    modelsTitle: "Каталог AI-моделей",
    modelsText: "Додаємо моделі лише за наявності офіційної сторінки розробника. Наявність у каталозі не є оцінкою якості чи рекомендацією.",
    providerNote: "Дані від розробника",
    directoryText: "Це окремі системи оцінювання, а не один спільний рейтинг. Відкривайте першоджерела, щоб перевіряти актуальну версію та методологію.",
    caution: "Важливе застереження",
  };

  return (
    <main className="ranking-page page-shell">
      <header className="ranking-hero">
        <div className="section-kicker">{text.kicker}</div>
        <h1>{text.title}<span>.</span></h1>
        <p>{text.intro}</p>
      </header>

      <section className="ranking-principles" aria-labelledby="ranking-principles-title">
        <h2 id="ranking-principles-title">{text.ruleTitle}</h2>
        <ul><li>{text.rule1}</li><li>{text.rule2}</li><li>{text.rule3}</li></ul>
      </section>

      {unavailable ? (
        <div className="ranking-empty"><h2>{text.unavailable}</h2><p>{text.emptyHint}</p></div>
      ) : sortedGroups.length === 0 ? (
        <div className="ranking-empty"><h2>{text.empty}</h2><p>{text.emptyHint}</p></div>
      ) : (
        <div className="ranking-groups">
          {sortedGroups.map((group) => (
            <section className="ranking-group" key={group.benchmark.id + group.version + group.harness}>
              <div className="ranking-group-heading">
                <div>
                  <span className="ranking-category">{group.benchmark.category}</span>
                  <h2>{group.benchmark.name}</h2>
                  <p>{group.version} · {group.harness}</p>
                </div>
                <a href={group.benchmark.leaderboard_url || group.benchmark.methodology_url} target="_blank" rel="noreferrer">{text.benchmarkSource} ↗</a>
              </div>
              <div className="ranking-table-wrap">
                <table className="ranking-table">
                  <thead><tr><th>#</th><th>{text.model}</th><th>{text.result}</th><th>{text.date}</th><th>{text.sample}</th><th>{text.source}</th></tr></thead>
                  <tbody>
                    {group.rows.map((row, index) => (
                      <tr key={row.id}>
                        <td>{index + 1}</td>
                        <td>{row.model.official_url ? <a href={row.model.official_url} target="_blank" rel="noreferrer">{row.model.name}</a> : row.model.name}<small>{row.model.provider}</small></td>
                        <td className="ranking-score">{Number(row.score).toLocaleString(en ? "en-US" : "uk-UA", { maximumFractionDigits: 3 })} {row.score_unit}</td>
                        <td>{new Date(row.evaluation_date + "T00:00:00").toLocaleDateString(en ? "en-US" : "uk-UA")}</td>
                        <td>{row.sample_size ?? text.noSample}</td>
                        <td><div className="ranking-evidence"><span>{text[row.evidence_grade as keyof typeof text] ?? row.evidence_grade}</span>{row.sources.map((source: Row) => <a key={source.id} href={source.source_url} target="_blank" rel="noreferrer">{source.source_title} ↗</a>)}</div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}

      {!unavailable && models.length > 0 && (
        <section className="ranking-model-directory">
          <div className="ranking-directory-heading">
            <h2>{text.modelsTitle}</h2>
            <p>{text.modelsText}</p>
          </div>
          <div className="ranking-model-grid">
            {models.map((model) => (
              <article className="ranking-model-card" key={model.id}>
                <div className="ranking-model-card-top">
                  <span className="ranking-category">{model.provider}</span>
                  <span className="ranking-model-date">{model.release_date ? new Date(model.release_date + "T00:00:00").toLocaleDateString(en ? "en-US" : "uk-UA") : ""}</span>
                </div>
                <h3>{model.official_url ? <a href={model.official_url} target="_blank" rel="noreferrer">{model.name} ↗</a> : model.name}</h3>
                <p>{[model.model_family, model.model_type].filter(Boolean).join(" · ")}</p>
                <span className="ranking-provider-note">{text.providerNote}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {!unavailable && benchmarks.length > 0 && (
        <section className="ranking-directory">
          <div className="ranking-directory-heading">
            <h2>{text.directoryTitle}</h2>
            <p>{text.directoryText}</p>
          </div>
          <div className="ranking-directory-grid">
            {benchmarks.map((benchmark) => (
              <article className="ranking-directory-card" key={benchmark.id}>
                <span className="ranking-category">{benchmark.category}</span>
                <h3>{benchmark.name}</h3>
                <p>{benchmark.description}</p>
                {benchmark.slug === "swe-bench-verified" && (
                  <p className="ranking-caution">{text.caution}: {en
                    ? "Independent reviews have raised concerns about contamination and test validity. We will show its results separately and with this context."
                    : "Незалежні огляди вказували на ризик витоку завдань і проблеми валідності тестів. Результати показуватимемо окремо й з цим контекстом."}</p>
                )}
                <div className="ranking-directory-links">
                  <a href={benchmark.methodology_url} target="_blank" rel="noreferrer">{text.benchmarkSource} ↗</a>
                  {benchmark.leaderboard_url && <a href={benchmark.leaderboard_url} target="_blank" rel="noreferrer">{en ? "Leaderboard" : "Таблиця результатів"} ↗</a>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="ranking-methodology">
        <h2>{text.methodology}</h2>
        <p>{en
          ? "Each row retains its original benchmark, version, harness, date, sample size and evidence links. A high score in one test does not imply that a model is best overall. We do not calculate a composite rank until there is a defensible, documented weighting method."
          : "Для кожного результату зберігаємо назву тесту, версію, середовище оцінювання, дату, розмір вибірки та посилання на докази. Високий бал в одному тесті не означає, що модель найкраща загалом. Загальний рейтинг не обчислюватимемо без обґрунтованої та відкритої методики зважування."}</p>
      </section>
    </main>
  );
}
