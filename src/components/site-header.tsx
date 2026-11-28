"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandSymbol } from "@/components/brand-symbol";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const copy = t(locale);
  const currentPath = (pathname || "/").replace(/^\/(uk|en)(?=\/|$)/, "") || "/";
  const pathFor = (path: string) => `/${locale}${path === "/" ? "" : path}`;
  const navItems = [
    { label: copy.navNews, href: "/news" },
    { label: locale === "en" ? "Rankings" : "Рейтинги", href: "/rankings" },
    { label: copy.navModels, href: "/category/ai-models" },
    { label: copy.navTools, href: "/category/tools" },
    { label: copy.navResearch, href: "/category/research" },
    { label: copy.navAbout, href: "/about" }
  ];
  function changeLocale(next: Locale) {
    if (next === locale) return;
    const target = `/${next}`;
    window.location.assign(target);
  }
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href={pathFor("/")} className="brand" aria-label="Future Sphere — home" onClick={() => setMenuOpen(false)}>
          <BrandSymbol />
          <span className="brand-wordmark">future<span>sphere</span></span>
        </Link>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label={locale === "uk" ? "Головна навігація" : "Main navigation"}>
          {navItems.map((item) => <Link key={item.href} href={pathFor(item.href)} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link href={pathFor("/search")} className="search-link" aria-label={copy.search} title={copy.search}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
          </Link>
          <div className="language-switch" role="group" aria-label={locale === "uk" ? "Мова сайту" : "Website language"}>
            <button type="button" onClick={() => changeLocale("uk")} className={locale === "uk" ? "is-active" : ""} aria-pressed={locale === "uk"}>UA</button>
            <button type="button" onClick={() => changeLocale("en")} className={locale === "en" ? "is-active" : ""} aria-pressed={locale === "en"}>EN</button>
          </div>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? (locale === "uk" ? "Закрити меню" : "Close menu") : (locale === "uk" ? "Відкрити меню" : "Open menu")} aria-expanded={menuOpen}><span /><span /></button>
        </div>
      </div>
    </header>
  );
}
