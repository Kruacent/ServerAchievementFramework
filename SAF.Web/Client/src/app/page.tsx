import Link from "next/link";
import { AchievementBrowser } from "@/components/AchievementBrowser";
import {
  PlayerLink,
  emptyClass,
  hoverUnderline,
  sectionTitleClass,
  titleClass,
} from "@/components/ui";
import {
  getAchievements,
  getLeaderboard,
  getOverview,
  getRecentUnlocks,
} from "@/utils/api";
import { achievementHref, displayName, playerHref, withRanks } from "@/utils/format";
import { getI18n } from "@/utils/locale";

export const dynamic = "force-dynamic";

const sectionHead = "mb-4 flex items-baseline justify-between gap-4";

export default async function Home() {
  const [{ t, relative }, overview, achievements, recent, leaderboard] =
    await Promise.all([
      getI18n(),
      getOverview(),
      getAchievements(),
      getRecentUnlocks(8),
      getLeaderboard(5),
    ]);
  const top = withRanks(leaderboard).filter((player) => player.unlocked > 0);

  return (
    <>
      <header className="mb-10">
        <h1 className={titleClass}>{t.home.title}</h1>
        <p className="mt-2 text-muted">
          {t.home.summary(
            overview.total_players,
            overview.total_unlocks,
            overview.average_completion,
          )}
        </p>
      </header>

      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_260px]">
        <section>
          <header className={sectionHead}>
            <h2 className="font-medium text-ink">
              {t.home.count(overview.total_achievements)}
            </h2>
            <span className="text-sm text-muted">{t.home.percentColumn}</span>
          </header>
          <AchievementBrowser
            achievements={achievements}
            hiddenCount={overview.hidden_achievements}
          />
        </section>

        <div className="space-y-12">
          <section>
            <header className={sectionHead}>
              <h2 className="font-medium text-ink">{t.home.topPlayers}</h2>
              <Link
                href="/leaderboard"
                className="text-sm text-ink underline underline-offset-4 hover:no-underline"
              >
                {t.home.seeAll}
              </Link>
            </header>
            {top.length === 0 ? (
              <p className={emptyClass}>{t.home.nobodyYet}</p>
            ) : (
              <ol className="space-y-3">
                {top.map((player) => (
                  <li key={player.userID} className="flex items-center gap-3">
                    <span className="w-4 tabular-nums text-muted">{player.rank}</span>
                    <div className="min-w-0 flex-1">
                      <PlayerLink player={player} />
                    </div>
                    <span className="tabular-nums text-muted">
                      {player.unlocked}/{overview.total_achievements}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section>
            <h2 className={sectionTitleClass}>{t.home.recent}</h2>
            {recent.length === 0 ? (
              <p className={emptyClass}>{t.home.noRecent}</p>
            ) : (
              <ul className="space-y-4">
                {recent.map(({ plugin, achievement_id, ...unlock }, index) => (
                  <li key={index}>
                    <Link
                      href={playerHref(unlock.userID)}
                      className={`text-ink ${hoverUnderline}`}
                    >
                      {displayName(unlock)}
                    </Link>
                    <span className="block text-sm">
                      {plugin === null || achievement_id === null ? (
                        t.home.aHidden
                      ) : (
                        <Link
                          href={achievementHref({ plugin, achievement_id })}
                          className={hoverUnderline}
                        >
                          {unlock.achName}
                        </Link>
                      )}
                      <span className="text-muted"> · {relative(unlock.obtained_at)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
