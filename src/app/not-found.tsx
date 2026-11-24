import Link from "next/link";

export default function NotFound() {
  return <section className="not-found page-shell"><span className="section-kicker">404 · НЕ ЗНАЙДЕНО</span><h1>Ця сторінка<br /><span>поза орбітою.</span></h1><p>Схоже, такого матеріалу поки немає або посилання змінилося.</p><Link href="/" className="button-primary">На головну <span>↗</span></Link></section>;
}
