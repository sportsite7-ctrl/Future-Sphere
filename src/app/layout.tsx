import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  verification: { google: "OzXopRCsAITVXAZ6F-izhB34Tjtq5fOv_9E5dxB13PA" },
  metadataBase: new URL("https://future-sphere-henna.vercel.app"),
  title: { default: "Future Sphere — AI news and insights", template: "%s | Future Sphere" },
  description: "News, research and clear explanations about artificial intelligence and emerging technology.",
  applicationName: "Future Sphere",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" },
  openGraph: { title: "Future Sphere — AI news and insights", description: "News, research and clear explanations about artificial intelligence and emerging technology.", type: "website", url: "https://future-sphere-henna.vercel.app", siteName: "Future Sphere" },
  robots: { index: true, follow: true }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
        <SiteHeader locale={locale} />
        <main>{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
