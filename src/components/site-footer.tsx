import Link from "next/link";
import { BrandSymbol } from "@/components/brand-symbol";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const pathFor = (path: string) => `/${locale}${path === "/" ? "" : path}`;
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Link href={pathFor("/")} className="brand footer-brand"><BrandSymbol /><span className="brand-wordmark">future<span>sphere</span></span></Link>
          <p className="footer-note">{copy.footerNote}</p>
        </div>
        <div className="footer-links">
          <Link href={pathFor("/news")}>{copy.footerNews}</Link><Link href={pathFor("/category/ai-models")}>{copy.navModels}</Link><Link href={pathFor("/category/tools")}>{copy.navTools}</Link><Link href={pathFor("/category/research")}>{copy.navResearch}</Link><Link href={pathFor("/about")}>{copy.footerAbout}</Link><Link href={pathFor("/search")}>{copy.search}</Link>
        </div>
      </div>
      <div className="footer-bottom"><span>© 2026 Future Sphere</span><span>{copy.footerTagline}</span></div>
    </footer>
  );
}
