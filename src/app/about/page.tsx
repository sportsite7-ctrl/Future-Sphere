import type { Metadata } from "next";
import Link from "next/link";
import { BrandSymbol } from "@/components/brand-symbol";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "en" ? "About Future Sphere" : "Про Future Sphere",
    description: locale === "en"
      ? "Learn about Future Sphere's approach to AI news, research, original sources and clear technology explanations."
      : "Дізнайтеся про редакційний підхід Future Sphere до новин ШІ, досліджень, першоджерел і пояснення технологій.",
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const copy = t(locale);
  return (
    <section className="about-page page-shell">
      <div className="article-breadcrumb"><Link href="/">{copy.home}</Link><span>/</span><span>{copy.about}</span></div>
      <div className="about-hero">
        <div className="about-symbol"><BrandSymbol large /></div>
        <div className="section-kicker">{copy.aboutKicker}</div>
        <h1>{copy.aboutTitleA}<br /><span>{copy.aboutTitleB}</span></h1>
        <p>{copy.aboutIntro}</p>
      </div>
      <div className="about-principles">
        {copy.principles.map(([label, title, description]) => <article key={label}><span>{label}</span><h2>{title}</h2><p>{description}</p></article>)}
      </div>
      <div className="about-note"><span className="section-kicker">{copy.development}</span><p>{copy.prototype}</p><Link href="/news" className="button-primary">{copy.viewMaterials} <span>↗</span></Link></div>
    </section>
  );
}
