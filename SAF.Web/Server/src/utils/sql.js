export const PLAYER_ID = `CONCAT(p.userID, '@', LOWER(p.authType))`;

export function parsePlayerId(id) {
    const at = id.lastIndexOf('@');
    if (at < 1 || at === id.length - 1) return null;
    return { userID: id.slice(0, at), authType: id.slice(at + 1) };
}

export const ACHIEVEMENT_COLUMNS = `
    a.achPlugin AS plugin,
    a.achId AS achievement_id,
    a.achDisplayName AS achName,
    a.achDescription AS description,
    a.achPlugin AS category,
    COALESCE(a.hidden, 0) AS hidden,
    a.target
`;

export const IS_VISIBLE = `COALESCE(a.hidden, 0) = 0`;

export const UNLOCKS = `(
    SELECT
        pa.aPlayer, pa.aPlayerAuth, pa.obtained_at,
        a.achId, a.achPlugin, a.achDisplayName, a.achDescription,
        COALESCE(a.hidden, 0) AS hidden
    FROM PlayersAchievement pa
    JOIN Achievements a
        ON a.achId = pa.AchievementId AND a.achPlugin = pa.aAchievementPlugin
    WHERE pa.progress >= a.target
)`;

export const JOIN_UNLOCKS_OF_ACHIEVEMENT = `
    LEFT JOIN ${UNLOCKS} u ON u.achId = a.achId AND u.achPlugin = a.achPlugin
`;

export const JOIN_UNLOCKS_OF_PLAYER = `
    LEFT JOIN ${UNLOCKS} u ON u.aPlayer = p.userID AND u.aPlayerAuth = p.authType
`;

export const PERCENT_OF_PLAYERS = `
    ROUND(COUNT(u.aPlayer) / NULLIF((SELECT COUNT(*) FROM Players), 0) * 100, 2)
`;

export const PERCENT_OF_ACHIEVEMENTS = `
    ROUND(COUNT(u.achId) / NULLIF((SELECT COUNT(*) FROM Achievements), 0) * 100, 2)
`;

export const LEADERBOARD = `
    SELECT
        ${PLAYER_ID} AS userID,
        COUNT(u.achId) AS unlocked,
        ${PERCENT_OF_ACHIEVEMENTS} AS percent_completed,
        MAX(u.obtained_at) AS last_unlock
    FROM Players p
    ${JOIN_UNLOCKS_OF_PLAYER}
    GROUP BY p.userID, p.authType
    ORDER BY unlocked DESC, last_unlock ASC, p.userID ASC
    LIMIT ?
`;
