import Link from "next/link";
import { buttonClass, titleClass } from "@/components/ui";
import { getI18n } from "@/utils/locale";

export default async function NotFound() {
  const { t } = await getI18n();
  return (
    <section className="max-w-xl">
      <h1 className={titleClass}>{t.notFound.title}</h1>
      <p className="mt-3">{t.notFound.body}</p>
      <Link href="/" className={`${buttonClass} mt-6 inline-block`}>
        {t.notFound.back}
      </Link>
    </section>
  );
}
