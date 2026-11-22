import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  AchievementRow,
  Avatar,
  ProgressBar,
  emptyClass,
  sectionTitleClass,
  titleClass,
} from "@/components/ui";
import { getAchievements, getOverview, getPlayer } from "@/utils/api";
import {
  achievementHref,
  achievementKey,
  decodeParam,
  displayName,
} from "@/utils/format";
import { getI18n } from "@/utils/locale";
import { buildProfile } from "@/utils/profile";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ userID: string }> };

const readUserID = async (params: Props["params"]) =>
  decodeParam((await params).userID);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ t }, player] = await Promise.all([
    getI18n(),
    getPlayer(await readUserID(params)),
  ]);
  return { title: player ? displayName(player) : t.profile.notFound };
}

export default async function PlayerPage({ params }: Props) {
  const [{ t, percent, date }, player, achievements, overview] = await Promise.all([
    getI18n(),
    getPlayer(await readUserID(params)),
    getAchievements(),
    getOverview(),
  ]);
  if (!player) notFound();

  const { unlocked, locked, hiddenLocked } = buildProfile(
    player,
    achievements,
    overview,
  );

  return (
    <>
      <header className="mb-14">
        <div className="flex items-center gap-4">
          <Avatar player={player} size={64} />
          <div className="min-w-0 flex-1">
            <h1 className={`truncate tabular-nums ${titleClass}`}>{displayName(player)}</h1>
            <p className="truncate font-mono text-xs text-muted">{player.userID}</p>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted">
          {player.unlocked > 0 && <>{t.profile.rank(player.rank)} · </>}
          <span className="text-ink">
            {t.profile.progress(player.unlocked, player.total_achievements)}
          </span>{" "}
          ({percent(player.percent_completed)})
        </p>
        <ProgressBar percent={player.percent_completed} className="mt-3" />
      </header>

      <div className="space-y-14">
        <section>
          <h2 className={sectionTitleClass}>{t.profile.unlocked(unlocked.length)}</h2>
          {unlocked.length === 0 ? (
            <p className={emptyClass}>{t.profile.none}</p>
          ) : (
            <ul className="space-y-1">
              {unlocked.map(({ global, ...achievement }, index) => (
                <li key={index}>
                  <AchievementRow
                    name={global ? achievement.achName : t.hiddenName}
                    description={achievement.description || t.noDescription}
                    state={global ? "unlocked" : "hidden"}
                    href={global && achievementHref(global)}
                    meta={global && t.ofPlayers(global.percent_completed)}
                    aside={
                      <span className="shrink-0 text-right text-xs text-muted">
                        {t.profile.unlockedOn}{" "}
                        <span className="sm:block sm:text-sm sm:text-body">
                          {date(achievement.obtained_at)}
                        </span>
                      </span>
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {locked.length + hiddenLocked > 0 && (
          <section>
            <h2 className={sectionTitleClass}>
              {t.profile.remaining(locked.length + hiddenLocked)}
            </h2>
            <ul className="space-y-1">
              {locked.map((achievement) => (
                <li key={achievementKey(achievement)}>
                  <AchievementRow
                    name={achievement.achName}
                    description={achievement.description || t.noDescription}
                    state="locked"
                    dimmed
                    href={achievementHref(achievement)}
                    meta={t.ofPlayers(achievement.percent_completed)}
                    aside={
                      achievement.progress && (
                        <span className="shrink-0 text-sm tabular-nums text-muted">
                          {achievement.progress.progress}/{achievement.progress.target}
                        </span>
                      )
                    }
                  />
                </li>
              ))}
              {hiddenLocked > 0 && (
                <li>
                  <AchievementRow
                    name={t.hiddenCount(hiddenLocked)}
                    description={t.hiddenDescription}
                    state="hidden"
                    dimmed
                  />
                </li>
              )}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
