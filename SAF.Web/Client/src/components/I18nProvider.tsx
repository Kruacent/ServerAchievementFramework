"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createI18n, type I18n, type Locale } from "@/utils/i18n";

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const value = useMemo(() => createI18n(locale), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Strings and formatters, for client components. Server ones use getI18n(). */
export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
