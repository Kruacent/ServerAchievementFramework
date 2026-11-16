import "server-only";

const API_URL = (process.env.API_URL ?? "http://localhost:5000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** GET a JSON resource. Resolves to null on 404, throws ApiError otherwise. */
async function get<T>(path: string): Promise<T | null> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/v1${path}`, { cache: "no-store" });
  } catch {
    throw new ApiError(`API injoignable (${API_URL}).`, 503);
  }

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new ApiError(
      `L’API a répondu avec le statut ${response.status}.`,
      response.status,
    );
  }
  return (await response.json()) as T;
}

async function getOrThrow<T>(path: string): Promise<T> {
  const data = await get<T>(path);
  if (data === null) throw new ApiError(`Ressource introuvable : ${path}`, 404);
  return data;
}

// mysql2 sends DECIMAL columns as strings and COUNT(*) as numbers; normalise once here.
type Raw<T> = { [K in keyof T]: T[K] extends number ? number | string | null : T[K] };
const num = (value: number | string | null | undefined) => Number(value ?? 0) || 0;

/**
 * A player. Name and avatar come from Steam, so both are null for other
 * account types, for unknown IDs and when the API has no Steam key.
 */
export type PlayerRef = {
  userID: string;
  userName: string | null;
  avatar: string | null;
};

/** Achievements are identified by the plugin declaring them plus their ID. */
export type AchievementRef = { plugin: string; achievement_id: string };

export type Achievement = AchievementRef & {
  achName: string;
  description: string | null;
  /** The declaring plugin: the database has no other grouping. */
  category: string;
  target: number;
  players_count: number;
  percent_completed: number;
};

export type AchievementDetail = Achievement & {
  players: (PlayerRef & { obtained_at: string })[];
};

export type RecentUnlock = PlayerRef & {
  /** Both null when the achievement is hidden. */
  plugin: string | null;
  achievement_id: string | null;
  achName: string;
  hidden: number;
  obtained_at: string;
};

export type PlayerSummary = PlayerRef & {
  unlocked: number;
};

export type LeaderboardEntry = PlayerSummary & {
  percent_completed: number;
  last_unlock: string | null;
};

export type PlayerAchievement = {
  /** Both null when the achievement is hidden. */
  plugin: string | null;
  achievement_id: string | null;
  achName: string;
  description: string | null;
  hidden: number;
  obtained_at: string;
};

export type Progress = AchievementRef & { progress: number; target: number };

export type PlayerDetail = PlayerSummary & {
  total_achievements: number;
  percent_completed: number;
  rank: number;
  achievements: PlayerAchievement[];
  /** Counters started but not completed yet. */
  in_progress: Progress[];
};

export type Overview = {
  total_players: number;
  total_achievements: number;
  hidden_achievements: number;
  total_unlocks: number;
  average_completion: number;
};

function normaliseAchievement<T extends Raw<Achievement>>(a: T) {
  return {
    ...a,
    players_count: num(a.players_count),
    percent_completed: num(a.percent_completed),
  };
}

export async function getAchievements(): Promise<Achievement[]> {
  const rows = await getOrThrow<Raw<Achievement>[]>("/achievement/all");
  return rows.map(normaliseAchievement) as Achievement[];
}

export async function getAchievement({
  plugin,
  achievement_id,
}: AchievementRef): Promise<AchievementDetail | null> {
  const row = await get<Raw<AchievementDetail>>(
    `/achievement/${encodeURIComponent(plugin)}/${encodeURIComponent(achievement_id)}`,
  );
  return row ? (normaliseAchievement(row) as AchievementDetail) : null;
}

export function getRecentUnlocks(limit = 10): Promise<RecentUnlock[]> {
  return getOrThrow<RecentUnlock[]>(`/achievement/recent?limit=${limit}`);
}

export async function getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const rows = await getOrThrow<Raw<LeaderboardEntry>[]>(
    `/players/leaderboard?limit=${limit}`,
  );
  return rows.map((row) => ({
    ...row,
    unlocked: num(row.unlocked),
    percent_completed: num(row.percent_completed),
  })) as LeaderboardEntry[];
}

export async function getPlayers(search = ""): Promise<PlayerSummary[]> {
  const rows = await getOrThrow<Raw<PlayerSummary>[]>(
    `/players/all?search=${encodeURIComponent(search)}`,
  );
  return rows.map((row) => ({ ...row, unlocked: num(row.unlocked) })) as PlayerSummary[];
}

export async function getPlayer(userID: string): Promise<PlayerDetail | null> {
  const row = await get<Raw<PlayerDetail>>(`/players/${encodeURIComponent(userID)}`);
  if (!row) return null;
  return {
    ...row,
    unlocked: num(row.unlocked),
    total_achievements: num(row.total_achievements),
    percent_completed: num(row.percent_completed),
    rank: num(row.rank),
  } as PlayerDetail;
}

export async function getOverview(): Promise<Overview> {
  const row = await getOrThrow<Raw<Overview>>("/stats/overview");
  return {
    total_players: num(row.total_players),
    total_achievements: num(row.total_achievements),
    hidden_achievements: num(row.hidden_achievements),
    total_unlocks: num(row.total_unlocks),
    average_completion: num(row.average_completion),
  };
}
