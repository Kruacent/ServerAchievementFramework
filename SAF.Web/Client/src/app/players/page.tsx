import type { Metadata } from "next";
import Link from "next/link";
import {
  Avatar,
  buttonClass,
  emptyClass,
  fieldClass,
  sectionTitleClass,
  titleClass,
} from "@/components/ui";
import { getPlayers } from "@/utils/api";
import { displayName, playerHref } from "@/utils/format";
import { getI18n } from "@/utils/locale";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getI18n()).t.players.title };
}

type Props = { searchParams: Promise<{ q?: string | string[] }> };

async function readQuery(searchParams: Props["searchParams"]) {
  const { q } = await searchParams;
  return (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
}

export default async function PlayersPage({ searchParams }: Props) {
  const query = await readQuery(searchParams);
  const [{ t }, players] = await Promise.all([getI18n(), getPlayers(query)]);

  return (
    <>
      <h1 className={`mb-10 ${titleClass}`}>{t.players.title}</h1>

      <form action="/players" className="mb-12 flex max-w-xl gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder={t.players.placeholder}
          aria-label={t.players.searchLabel}
          className={`${fieldClass} min-w-0 flex-1`}
        />
        <button type="submit" className={buttonClass}>
          {t.players.search}
        </button>
      </form>

      <section>
        <h2 className={sectionTitleClass}>
          {query
            ? t.players.resultsFor(players.length, query)
            : t.playerCount(players.length)}
        </h2>
        {players.length === 0 ? (
          <p className={emptyClass}>{query ? t.players.noMatch : t.players.empty}</p>
        ) : (
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {players.map((player) => (
              <li key={player.userID} className="border-t border-line">
                <Link
                  href={playerHref(player.userID)}
                  className="group flex items-center gap-3 py-3"
                >
                  <Avatar player={player} size={36} />
                  <span className="min-w-0">
                    <span className="block truncate tabular-nums text-ink underline-offset-4 group-hover:underline">
                      {displayName(player)}
                    </span>
                    <span className="block text-sm text-muted">
                      {t.players.unlocked(player.unlocked)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
