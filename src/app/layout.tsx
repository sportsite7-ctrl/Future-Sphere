import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: { default: "Future Sphere — світ штучного інтелекту", template: "%s | Future Sphere" },
  description: "Новини, дослідження та зрозумілі пояснення про штучний інтелект і технології майбутнього.",
  applicationName: "Future Sphere",
  openGraph: { title: "Future Sphere", description: "Технології майбутнього — зрозуміло сьогодні.", type: "website", locale: "uk_UA" },
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body>
        <div className="demo-ribbon"><span>ПРОТОТИП</span> Демонстраційна версія — матеріали на сторінках є прикладами, а не актуальними новинами.</div>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
