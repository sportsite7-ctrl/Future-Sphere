import type { Story } from "@/lib/stories";

export type Locale = "uk" | "en";

const ui = {
  uk: {
    navNews: "Новини", navModels: "Моделі ШІ", navTools: "Інструменти", navResearch: "Дослідження", navAbout: "Про нас",
    search: "Пошук", home: "Головна", allNews: "Усі матеріали", about: "Про проєкт",
    heroEyebrow: "THE AI BRIEFING", heroTitleA: "Майбутнє вже", heroTitleB: "відбувається.",
    heroText: "Головне зі світу штучного інтелекту. Без зайвого шуму — з контекстом, поясненнями та ідеями.",
    explore: "Досліджувати AI", howItWorks: "Як це працює", editorPick: "ВИБІР РЕДАКЦІЇ · ДЕМО", read: "Читати матеріал",
    navigation: "НАВІГАЦІЯ", worthKnowing: "ВАРТО ЗНАТИ", ideas: "Ідеї, що формують завтра", allMaterials: "Усі матеріали",
    freshView: "СВІЖИЙ ПОГЛЯД", latest: "Останні матеріали", demoFeed: "Демо-стрічка",
    lessNoise: "Менше шуму.", moreUnderstanding: "Більше розуміння.", editorialText: "Ми пояснюємо не лише що сталося, а й чому це має значення.",
    editorialApproach: "Наш редакційний підхід", focus: "У ФОКУСІ", focusTitle: "Теми, за якими варто стежити",
    newModels: "Нові AI-моделі", aiTools: "AI-інструменти", openResearch: "Відкриті дослідження", newTech: "Нові технології",
    manifestoTitle: "Зрозуміти технології.", manifestoSub: "Побачити можливості.", manifestoText: "Ми створюємо простір, де складні технології стають зрозумілими, а важливі відкриття не губляться серед інформаційного потоку.",
    footerNote: "Технології майбутнього — зрозуміло сьогодні.", footerNews: "Усі новини", footerAbout: "Про проєкт", footerTagline: "Незалежний погляд на розвиток AI",
    library: "БІБЛІОТЕКА FUTURE SPHERE", listingDescription: "Добірка матеріалів про нові моделі, AI-інструменти, дослідження та технології. Зараз тут розміщені демонстраційні публікації.",
    demoLabel: "Демонстраційна стрічка", searchIntro: "Знайдіть матеріали про моделі, інструменти та дослідження штучного інтелекту.",
    searchPlaceholder: "Наприклад, AI-моделі або дослідження...", searchButton: "Шукати", searchResults: "Результати для", noResults: "Нічого не знайдено. Спробуйте інший запит або перегляньте",
    searchHint: "Почніть із назви теми або ключового слова.", readArticle: "Читати матеріал", demoArticle: "ДЕМО-МАТЕРІАЛ",
    editor: "Редакція Future Sphere", articleDemo: "ЦЕ ДЕМО-МАТЕРІАЛ. Текст створено для демонстрації структури майбутньої публікації.",
    sourceNote: "Примітка редакції", sourceText: "У робочій версії тут буде вказано першоджерело, авторство та пов'язані матеріали.",
    backHome: "← Повернутися до стрічки", continueReading: "ПРОДОВЖИТИ ЧИТАТИ", moreFrom: "Ще у Future Sphere",
    categoryKicker: "РУБРИКА FUTURE SPHERE", emptyCategory: "У цій рубриці поки немає матеріалів.",
    aboutKicker: "ПРО FUTURE SPHERE", aboutTitleA: "Технології змінюються швидко.", aboutTitleB: "Розуміння має встигати.",
    aboutIntro: "Future Sphere — майбутній незалежний інформаційний простір про штучний інтелект. Ми прагнемо збирати важливі оновлення в одному місці й пояснювати, що вони означають на практиці.",
    principles: [
      ["01 / ВІДБІР","Важливе, а не просто гучне","Фокус на значущих запусках, дослідженнях, інструментах і змінах у сфері AI. Менше повторів і другорядних анонсів."],
      ["02 / КОНТЕКСТ","Не лише що сталося","Пояснювати, чому новина важлива, кому стане у пригоді та які обмеження варто враховувати."],
      ["03 / ДЖЕРЕЛА","Прозорість і перевірка","У робочій версії публікації матимуть посилання на першоджерела, дати та чітке розділення фактів і редакційних пояснень."]
    ],
    development: "ЗАРАЗ МИ НА ЕТАПІ РОЗРОБКИ", prototype: "Цей сайт поки що є прототипом. Тексти на головній сторінці та в матеріалах демонстраційні й не є стрічкою актуальних новин.",
    viewMaterials: "Переглянути матеріали", notFound: "Ця сторінка поза орбітою.", notFoundText: "Схоже, такого матеріалу поки немає або посилання змінилося.", goHome: "На головну",
    categories: {
      "ai-models": ["ШІ та моделі","Нові моделі, можливості та практичні порівняння."],
      tools: ["Інструменти","Сервіси та продукти, які допомагають працювати з AI."],
      research: ["Дослідження","Наукові роботи, тести та технологічні прориви."],
      technology: ["Технології","Інфраструктура, мультимодальність і нові підходи."],
      industry: ["Індустрія","Компанії, ринок і розвиток AI-екосистеми."]
    }
  },
  en: {
    navNews: "News", navModels: "AI Models", navTools: "Tools", navResearch: "Research", navAbout: "About",
    search: "Search", home: "Home", allNews: "All stories", about: "About",
    heroEyebrow: "THE AI BRIEFING", heroTitleA: "The future is", heroTitleB: "already happening.",
    heroText: "What matters in artificial intelligence. Less noise, more context, clear explanations and ideas.",
    explore: "Explore AI", howItWorks: "Our approach", editorPick: "EDITOR'S PICK · DEMO", read: "Read story",
    navigation: "EXPLORE", worthKnowing: "WORTH KNOWING", ideas: "Ideas shaping tomorrow", allMaterials: "All stories",
    freshView: "A FRESH PERSPECTIVE", latest: "Latest stories", demoFeed: "Demo feed",
    lessNoise: "Less noise.", moreUnderstanding: "More understanding.", editorialText: "We explain not only what happened, but why it matters.",
    editorialApproach: "Our editorial approach", focus: "IN FOCUS", focusTitle: "Topics worth following",
    newModels: "New AI models", aiTools: "AI tools", openResearch: "Open research", newTech: "Emerging technology",
    manifestoTitle: "Understand technology.", manifestoSub: "See the possibilities.", manifestoText: "A place where complex technology becomes easier to understand and important discoveries don't get lost in the information stream.",
    footerNote: "Tomorrow's technology, understood today.", footerNews: "All news", footerAbout: "About the project", footerTagline: "An independent view of AI",
    library: "THE FUTURE SPHERE LIBRARY", listingDescription: "Stories about new models, AI tools, research and technology. These are demonstration articles for now.",
    demoLabel: "Demo feed", searchIntro: "Find stories about AI models, tools and research.",
    searchPlaceholder: "For example, AI models or research...", searchButton: "Search", searchResults: "Results for", noResults: "No results found. Try another search or browse",
    searchHint: "Start with a topic or keyword.", readArticle: "Read story", demoArticle: "DEMO ARTICLE",
    editor: "Future Sphere Editorial Team", articleDemo: "THIS IS A DEMO ARTICLE. The text illustrates the planned format of a Future Sphere publication.",
    sourceNote: "Editor's note", sourceText: "The live version will include the original source, byline and related coverage.",
    backHome: "← Back to the news feed", continueReading: "KEEP READING", moreFrom: "More from Future Sphere",
    categoryKicker: "FUTURE SPHERE TOPIC", emptyCategory: "There are no stories in this topic yet.",
    aboutKicker: "ABOUT FUTURE SPHERE", aboutTitleA: "Technology moves fast.", aboutTitleB: "Understanding should keep up.",
    aboutIntro: "Future Sphere is an upcoming independent publication about artificial intelligence. Our goal is to bring important updates together and explain what they mean in practice.",
    principles: [
      ["01 / SELECTION","What matters, not just what makes noise","We focus on meaningful launches, research, tools and shifts in AI. Less repetition and fewer minor announcements."],
      ["02 / CONTEXT","More than what happened","We explain why a story matters, who it may help and which limitations are worth keeping in mind."],
      ["03 / SOURCES","Transparency and verification","The live publication will link to original sources, include dates and clearly distinguish facts from editorial explanation."]
    ],
    development: "CURRENTLY IN DEVELOPMENT", prototype: "This website is still a prototype. Homepage copy and articles are examples, not a feed of current news.",
    viewMaterials: "Browse demo stories", notFound: "This page is off the radar.", notFoundText: "This story may not exist yet, or the link may have changed.", goHome: "Go home",
    categories: {
      "ai-models": ["AI & Models","New models, capabilities and practical comparisons."],
      tools: ["Tools","Services and products that help people work with AI."],
      research: ["Research","Papers, evaluations and technological breakthroughs."],
      technology: ["Technology","Infrastructure, multimodality and new approaches."],
      industry: ["Industry","Companies, markets and the evolving AI ecosystem."]
    }
  }
} as const;

export function t(locale: Locale) {
  return ui[locale];
}

const storyEnglish: Record<string, { category: string; title: string; excerpt: string; date: string; readTime: string; imageAlt: string; body: string[] }> = {
  "next-generation-ai-assistants": {
    category: "AI & Models", title: "The next generation of AI assistants: from answers to real work",
    excerpt: "How models are changing as they move beyond generating text to helping people complete complex tasks.",
    date: "November 24, 2026", readTime: "6 min read", imageAlt: "Abstract digital visualization of artificial intelligence",
    body: [
      "This demo story shows the planned Future Sphere article format. In the live version, every story will include a link to its original source, a date and a clear distinction between facts and explanation.",
      "AI assistants are moving from short answers to multi-step work: analyzing documents, supporting research and interacting with software tools.",
      "Readers need more than a model announcement. They need to understand what it can do, where its limits are and whether it is available for free.",
      "Future Sphere plans to add practical context, comparisons and links to official announcements."
    ]
  },
  "small-models-big-capabilities": {
    category: "Research", title: "Small models, big capabilities: why efficiency matters",
    excerpt: "Local deployment, speed and lower costs are changing how people use artificial intelligence.",
    date: "November 24, 2026", readTime: "4 min read", imageAlt: "Electronic circuit board and microchips",
    body: [
      "This is an example of the structure planned for future analysis. In the live publication, the article will be supported by research and original sources.",
      "Compact models can make AI more accessible on everyday devices and reduce dependence on remote servers.",
      "Results should be evaluated by task: speed, accuracy, memory use, cost and language quality."
    ]
  },
  "ai-in-everyday-tools": {
    category: "Tools", title: "AI tools without the noise: how to find services that are actually useful",
    excerpt: "Not every high-profile launch changes the way we work. Here's what to look at instead.",
    date: "November 23, 2026", readTime: "5 min read", imageAlt: "A desk with a laptop",
    body: [
      "This demo story shows how Future Sphere plans to explain the practical value of new services.",
      "When choosing a tool, consider its free plan, usage limits, supported languages, privacy and ease of use.",
      "Later, these stories will be complemented by a dedicated tool directory with filters and comparisons."
    ]
  },
  "multimodal-ai-explained": {
    category: "Technology", title: "Multimodal AI explained: text, images, audio and video",
    excerpt: "What happens when one model can understand different types of information?",
    date: "November 22, 2026", readTime: "7 min read", imageAlt: "Abstract scientific visualization",
    body: [
      "This is demo copy for the Future Sphere prototype, not a current news story.",
      "Multimodal systems work with several types of information, including images, audio, video and text.",
      "Quality depends on the task, data and evaluation method. That's why it's important to explain limitations as well as capabilities."
    ]
  },
  "ai-industry-explained": {
    category: "Industry", title: "From labs to products: how AI research reaches the industry",
    excerpt: "Teams, infrastructure and open research are shaping a new technology ecosystem.",
    date: "November 21, 2026", readTime: "5 min read", imageAlt: "A robotic technology system",
    body: [
      "A demo story for a future section about the AI industry.",
      "The path from research to product includes validation, testing, cost evaluation, integration and feedback.",
      "Future Sphere aims to explain these processes clearly, without turning technology coverage into advertising."
    ]
  }
};

export function localizeStory(story: Story, locale: Locale): Story {
  if (locale === "uk") return story;
  const translated = storyEnglish[story.slug];
  return translated ? { ...story, ...translated } : story;
}

export function categoryText(slug: string, locale: Locale, fallback: { name: string; description: string }) {
  if (locale === "uk") return fallback;
  const value = ui.en.categories[slug as keyof typeof ui.en.categories];
  return value ? { name: value[0], description: value[1] } : fallback;
}
