"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandSymbol } from "@/components/brand-symbol";

const navItems = [
  { label: "Новини", href: "/news" },
  { label: "Моделі ШІ", href: "/category/ai-models" },
  { label: "Інструменти", href: "/category/tools" },
  { label: "Дослідження", href: "/category/research" },
  { label: "Про нас", href: "/about" }
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Future Sphere — головна" onClick={() => setMenuOpen(false)}>
          <BrandSymbol />
          <span className="brand-wordmark">future<span>sphere</span></span>
        </Link>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Головна навігація">
          {navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link href="/search" className="search-link" aria-label="Відкрити пошук" title="Пошук">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
          </Link>
          <span className="language-pill" aria-label="Поточна мова: українська" title="Англійська версія з'явиться на наступному етапі">UA <span>⌄</span></span>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"} aria-expanded={menuOpen}><span /><span /></button>
        </div>
      </div>
    </header>
  );
}
