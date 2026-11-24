import Link from "next/link";
import { BrandSymbol } from "@/components/brand-symbol";

export const metadata = {
  title: "Про Future Sphere",
  description: "Редакційний підхід Future Sphere: важливі новини про AI з контекстом, поясненнями та посиланнями на першоджерела."
};

export default function AboutPage() {
  return (
    <section className="about-page page-shell">
      <div className="article-breadcrumb"><Link href="/">Головна</Link><span>/</span><span>Про проєкт</span></div>
      <div className="about-hero">
        <div className="about-symbol"><BrandSymbol large /></div>
        <div className="section-kicker">ПРО FUTURE SPHERE</div>
        <h1>Технології змінюються швидко.<br /><span>Розуміння має встигати.</span></h1>
        <p>Future Sphere — майбутній незалежний інформаційний простір про штучний інтелект. Ми прагнемо збирати важливі оновлення в одному місці й пояснювати, що вони означають на практиці.</p>
      </div>
      <div className="about-principles">
        <article><span>01 / ВІДБІР</span><h2>Важливе, а не просто гучне</h2><p>Фокус на значущих запусках, дослідженнях, інструментах і змінах у сфері AI. Менше повторів і другорядних анонсів.</p></article>
        <article><span>02 / КОНТЕКСТ</span><h2>Не лише що сталося</h2><p>Пояснювати, чому новина важлива, кому стане у пригоді та які обмеження варто враховувати.</p></article>
        <article><span>03 / ДЖЕРЕЛА</span><h2>Прозорість і перевірка</h2><p>У робочій версії публікації матимуть посилання на першоджерела, дати та чітке розділення фактів і редакційних пояснень.</p></article>
      </div>
      <div className="about-note"><span className="section-kicker">ЗАРАЗ МИ НА ЕТАПІ РОЗРОБКИ</span><p>Цей сайт поки що є прототипом. Тексти на головній сторінці та в матеріалах демонстраційні й не є стрічкою актуальних новин.</p><Link href="/news" className="button-primary">Переглянути матеріали <span>↗</span></Link></div>
    </section>
  );
}
