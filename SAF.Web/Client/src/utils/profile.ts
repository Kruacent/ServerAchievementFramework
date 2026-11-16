import type {
  Achievement,
  Overview,
  PlayerAchievement,
  PlayerDetail,
  Progress,
} from "./api";
import { achievementKey } from "./format";

export type Unlocked = PlayerAchievement & { global?: Achievement };

export type Locked = Achievement & { progress?: Progress };

export type Profile = {
  unlocked: Unlocked[];
  locked: Locked[];
  hiddenLocked: number;
};

function keyOf({ plugin, achievement_id }: PlayerAchievement) {
  if (plugin === null || achievement_id === null) return null;
  return achievementKey({ plugin, achievement_id });
}

function attachGlobal(player: PlayerDetail, achievements: Achievement[]): Unlocked[] {
  const byKey = new Map(achievements.map((a) => [achievementKey(a), a]));
  return player.achievements.map((achievement) => {
    const key = keyOf(achievement);
    return { ...achievement, global: key === null ? undefined : byKey.get(key) };
  });
}

function lockedOf(
  unlocked: Unlocked[],
  achievements: Achievement[],
  inProgress: Progress[],
): Locked[] {
  const owned = new Set(unlocked.map(keyOf));
  const progressByKey = new Map(inProgress.map((p) => [achievementKey(p), p]));
  return achievements
    .filter((a) => !owned.has(achievementKey(a)))
    .map((a) => ({ ...a, progress: progressByKey.get(achievementKey(a)) }))
    .sort((a, b) => b.percent_completed - a.percent_completed);
}

export function buildProfile(
  player: PlayerDetail,
  achievements: Achievement[],
  overview: Overview,
): Profile {
  const unlocked = attachGlobal(player, achievements);
  const hiddenUnlocked = unlocked.filter((a) => a.hidden).length;

  return {
    unlocked,
    locked: lockedOf(unlocked, achievements, player.in_progress),
    hiddenLocked: Math.max(0, overview.hidden_achievements - hiddenUnlocked),
  };
}
