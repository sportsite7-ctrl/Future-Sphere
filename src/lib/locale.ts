import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get("fs-locale")?.value;
  return value === "en" ? "en" : "uk";
}
