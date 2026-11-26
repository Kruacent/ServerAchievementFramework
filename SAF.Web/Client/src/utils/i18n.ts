import { en } from "./locales/en";
import { fr, type Formatters } from "./locales/fr";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const LOCALE_COOKIE = "lang";

export const isLocale = (value: unknown): value is Locale =>
  locales.includes(value as Locale);

const tags: Record<Locale, string> = { fr: "fr-FR", en: "en-GB" };

/** Strings and formatters for one language. Pure: usable on server and client. */
export function createI18n(locale: Locale) {
  const tag = tags[locale];
  const numberFormat = new Intl.NumberFormat(tag);
  const percentFormat = new Intl.NumberFormat(tag, {
    style: "percent",
    maximumFractionDigits: 1,
  });
  const dateFormat = new Intl.DateTimeFormat(tag, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const relativeFormat = new Intl.RelativeTimeFormat(tag, { numeric: "auto" });

  const formatters: Formatters = {
    number: (value) => numberFormat.format(value),
    percent: (value) => percentFormat.format(value / 100),
  };
  const t = (locale === "fr" ? fr : en)(formatters);

  return {
    locale,
    t,
    ...formatters,
    date: (iso: string) => dateFormat.format(new Date(iso)),
    relative(iso: string, now = Date.now()) {
      const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
      const steps: [Intl.RelativeTimeFormatUnit, number][] = [
        ["year", 31_536_000],
        ["month", 2_592_000],
        ["day", 86_400],
        ["hour", 3_600],
        ["minute", 60],
      ];
      for (const [unit, size] of steps) {
        if (Math.abs(seconds) >= size) {
          return relativeFormat.format(Math.round(seconds / size), unit);
        }
      }
      return t.justNow;
    },
  };
}

export type I18n = ReturnType<typeof createI18n>;
