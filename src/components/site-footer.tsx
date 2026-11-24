import Link from "next/link";
import { BrandSymbol } from "@/components/brand-symbol";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = t(locale);
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Link href="/" className="brand footer-brand"><BrandSymbol /><span className="brand-wordmark">future<span>sphere</span></span></Link>
          <p className="footer-note">{copy.footerNote}</p>
        </div>
        <div className="footer-links">
          <Link href="/news">{copy.footerNews}</Link><Link href="/category/ai-models">{copy.navModels}</Link><Link href="/category/tools">{copy.navTools}</Link><Link href="/category/research">{copy.navResearch}</Link><Link href="/about">{copy.footerAbout}</Link><Link href="/search">{copy.search}</Link>
        </div>
      </div>
      <div className="footer-bottom"><span>© 2026 Future Sphere</span><span>{copy.footerTagline}</span></div>
    </footer>
  );
}
