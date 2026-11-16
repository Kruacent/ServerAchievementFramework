import "server-only";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { LOCALE_COOKIE, createI18n, isLocale, type Locale } from "./i18n";

/** The visitor's language: their explicit choice (cookie), else the browser's. */
export const getLocale = cache(async (): Promise<Locale> => {
  const chosen = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;

  const preferred = (await headers()).get("accept-language") ?? "";
  return preferred.trim().toLowerCase().startsWith("fr") ? "fr" : "en";
});

export const getI18n = cache(async () => createI18n(await getLocale()));
