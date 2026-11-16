"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LOCALE_COOKIE, locales, type Locale } from "@/utils/i18n";
import { useI18n } from "./I18nProvider";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale } = useI18n();

  const links = [
    { href: "/", label: t.nav.achievements },
    { href: "/leaderboard", label: t.nav.leaderboard },
    { href: "/players", label: t.nav.players },
  ];
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/" || pathname.startsWith("/achievements")
      : pathname.startsWith(href);

  function choose(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-1 px-5 py-4 sm:px-8">
        <Link href="/" className="font-semibold text-ink">
          SAF
        </Link>

        <nav className="order-last flex w-full gap-6 text-sm sm:order-none sm:w-auto">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={active ? "text-ink" : "text-muted hover:text-ink"}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div role="group" aria-label={t.language} className="ml-auto flex gap-3 text-sm">
          {locales.map((code) => (
            <button
              key={code}
              type="button"
              lang={code}
              onClick={() => choose(code)}
              aria-pressed={code === locale}
              className={
                code === locale
                  ? "cursor-default text-ink underline underline-offset-4"
                  : "cursor-pointer text-muted hover:text-ink"
              }
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
