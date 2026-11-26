import type { AchievementRef, PlayerRef } from "./api";

/** The Steam name when there is one, otherwise the ID without its "@steam" suffix. */
export function displayName({ userID, userName }: Pick<PlayerRef, "userID" | "userName">) {
  if (userName?.trim()) return userName.trim();
  const at = userID.lastIndexOf("@");
  return at > 0 ? userID.slice(0, at) : userID;
}

export const playerHref = (userID: string) => `/players/${encodeURIComponent(userID)}`;

export const achievementKey = ({ plugin, achievement_id }: AchievementRef) =>
  `${plugin}/${achievement_id}`;

export const achievementHref = ({ plugin, achievement_id }: AchievementRef) =>
  `/achievements/${encodeURIComponent(plugin)}/${encodeURIComponent(achievement_id)}`;

/** Route params can reach a page still percent-encoded ("%40" for "@"). */
export function decodeParam(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Competition ranking (1, 2, 2, 4) on an already sorted list. */
export function withRanks<T extends { unlocked: number }>(rows: T[]) {
  let rank = 0;
  return rows.map((row, index) => {
    if (index === 0 || row.unlocked !== rows[index - 1].unlocked) rank = index + 1;
    return { ...row, rank };
  });
}
