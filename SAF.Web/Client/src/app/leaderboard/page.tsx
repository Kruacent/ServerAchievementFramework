import type { Metadata } from "next";
import { PlayerLink, ProgressBar, emptyClass, titleClass } from "@/components/ui";
import { getLeaderboard, getOverview } from "@/utils/api";
import { withRanks } from "@/utils/format";
import { getI18n } from "@/utils/locale";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getI18n()).t.leaderboard.title };
}

const th = "pb-3 font-normal";
const td = "border-t border-line py-3";
const tabletUp = "hidden sm:table-cell";
const desktopUp = "hidden md:table-cell";

export default async function LeaderboardPage() {
  const [{ t, percent, relative }, players, overview] = await Promise.all([
    getI18n(),
    getLeaderboard(100),
    getOverview(),
  ]);
  const total = overview.total_achievements;

  return (
    <>
      <header className="mb-10">
        <h1 className={titleClass}>{t.leaderboard.title}</h1>
        <p className="mt-2 text-muted">{t.leaderboard.intro(total)}</p>
      </header>

      {players.length === 0 ? (
        <p className={emptyClass}>{t.leaderboard.empty}</p>
      ) : (
        <table className="w-full text-left">
          <thead className="text-sm text-muted">
            <tr>
              <th className={`${th} pr-5`}>#</th>
              <th className={th}>{t.leaderboard.player}</th>
              <th className={`${th} pl-4 text-right`}>{t.leaderboard.achievements}</th>
              <th className={`${th} ${tabletUp} pl-10`}>{t.leaderboard.progress}</th>
              <th className={`${th} ${desktopUp} pl-8 text-right whitespace-nowrap`}>
                {t.leaderboard.lastUnlock}
              </th>
            </tr>
          </thead>
          <tbody>
            {withRanks(players).map((player) => (
              <tr key={player.userID}>
                <td className={`${td} pr-5 tabular-nums text-muted`}>{player.rank}</td>
                <td className={`${td} w-full max-w-0`}>
                  <PlayerLink player={player} />
                </td>
                <td className={`${td} pl-4 text-right whitespace-nowrap tabular-nums text-ink`}>
                  {player.unlocked}
                  <span className="text-muted">/{total}</span>
                </td>
                <td className={`${td} ${tabletUp} pl-10`}>
                  <div className="flex w-44 items-center gap-3">
                    <ProgressBar percent={player.percent_completed} className="flex-1" />
                    <span className="w-14 text-right text-sm tabular-nums text-muted">
                      {percent(player.percent_completed)}
                    </span>
                  </div>
                </td>
                <td
                  className={`${td} ${desktopUp} pl-8 text-right text-sm whitespace-nowrap text-muted`}
                >
                  {player.last_unlock ? relative(player.last_unlock) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
