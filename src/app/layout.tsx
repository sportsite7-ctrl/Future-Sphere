import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Future Sphere — AI news and insights", template: "%s | Future Sphere" },
  description: "News, research and clear explanations about artificial intelligence and emerging technology.",
  applicationName: "Future Sphere",
  openGraph: { title: "Future Sphere", description: "Tomorrow's technology, understood today.", type: "website" },
  robots: { index: false, follow: false }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const copy = t(locale);
  return (
    <html lang={locale}>
      <body>
        <div className="demo-ribbon"><span>{locale === "en" ? "PROTOTYPE" : "ПРОТОТИП"}</span> {copy.prototype}</div>
        <SiteHeader locale={locale} />
        <main>{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
