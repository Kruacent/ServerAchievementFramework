"use client";

import { useI18n } from "@/components/I18nProvider";
import { buttonClass, titleClass } from "@/components/ui";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const { t } = useI18n();
  return (
    <section aria-live="polite" className="max-w-xl">
      <h1 className={titleClass}>{t.error.title}</h1>
      <p className="mt-3">{t.error.body}</p>
      <button type="button" onClick={reset} className={`${buttonClass} mt-6`}>
        {t.error.retry}
      </button>
    </section>
  );
}
