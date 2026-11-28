import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getLocale();
  const copy = t(locale);
  const homePath = `/${locale}`;
  return <section className="not-found page-shell"><span className="section-kicker">404 · {locale === "en" ? "NOT FOUND" : "НЕ ЗНАЙДЕНО"}</span><h1>{copy.notFound}</h1><p>{copy.notFoundText}</p><Link href={homePath} className="button-primary">{copy.goHome} <span>↗</span></Link></section>;
}
