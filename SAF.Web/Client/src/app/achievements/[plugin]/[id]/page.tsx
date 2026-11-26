import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PlayerLink,
  ProgressBar,
  Trophy,
  emptyClass,
  sectionTitleClass,
  titleClass,
} from "@/components/ui";
import { getAchievement, type AchievementRef } from "@/utils/api";
import { decodeParam } from "@/utils/format";
import { getI18n } from "@/utils/locale";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ plugin: string; id: string }> };

async function readRef(params: Props["params"]): Promise<AchievementRef> {
  const { plugin, id } = await params;
  return { plugin: decodeParam(plugin), achievement_id: decodeParam(id) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ t }, achievement] = await Promise.all([
    getI18n(),
    getAchievement(await readRef(params)),
  ]);
  return { title: achievement?.achName ?? t.achievement.notFound };
}

export default async function AchievementPage({ params }: Props) {
  const [{ t, percent, date }, achievement] = await Promise.all([
    getI18n(),
    getAchievement(await readRef(params)),
  ]);
  if (!achievement) notFound();

  return (
    <>
      <Link href="/" className="text-sm text-muted hover:text-ink">
        ← {t.achievement.back}
      </Link>

      <header className="mt-8 mb-14">
        <div className="flex items-start gap-4">
          <Trophy size={44} />
          <div className="min-w-0 flex-1">
            <h1 className={titleClass}>{achievement.achName}</h1>
            <p className="mt-2">{achievement.description || t.noDescription}</p>
            <p className="mt-1 text-sm text-muted">{achievement.category}</p>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted">
          <span className="text-base tabular-nums text-ink">
            {percent(achievement.percent_completed)}
          </span>{" "}
          {t.achievement.share}
        </p>
        <ProgressBar percent={achievement.percent_completed} className="mt-3" />
      </header>

      <section>
        <h2 className={sectionTitleClass}>
          {t.achievement.unlockedBy(achievement.players_count)}
        </h2>
        {achievement.players.length === 0 ? (
          <p className={emptyClass}>{t.achievement.nobody}</p>
        ) : (
          <ul>
            {achievement.players.map((player) => (
              <li
                key={player.userID}
                className="flex items-center justify-between gap-4 border-t border-line py-3"
              >
                <PlayerLink player={player} />
                <span className="shrink-0 text-sm text-muted">
                  {date(player.obtained_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
