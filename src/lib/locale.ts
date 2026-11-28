import { headers } from "next/headers";
import type { Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  return (await headers()).get("x-fs-locale") === "en" ? "en" : "uk";
}

export function localePath(locale: Locale, path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export function localeUrl(locale: Locale, path = "/"): string {
  return `https://future-sphere-henna.vercel.app${localePath(locale, path)}`;
}
