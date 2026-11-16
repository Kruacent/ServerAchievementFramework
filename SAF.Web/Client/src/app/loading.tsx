"use client";

import { useI18n } from "@/components/I18nProvider";

export default function Loading() {
  const { t } = useI18n();
  return (
    <p role="status" className="text-muted">
      {t.loading}
    </p>
  );
}
