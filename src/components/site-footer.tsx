import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Link href="/" className="brand footer-brand"><span className="brand-mark"><span>F</span><i /></span><span className="brand-wordmark">future<span>sphere</span></span></Link>
          <p className="footer-note">Технології майбутнього — зрозуміло сьогодні.</p>
        </div>
        <div className="footer-links">
          <Link href="/">Новини</Link><Link href="/category/ai-models">Моделі ШІ</Link><Link href="/category/tools">Інструменти</Link><Link href="/category/research">Дослідження</Link>
        </div>
      </div>
      <div className="footer-bottom"><span>© 2026 Future Sphere</span><span>Незалежний погляд на розвиток AI</span></div>
    </footer>
  );
}
