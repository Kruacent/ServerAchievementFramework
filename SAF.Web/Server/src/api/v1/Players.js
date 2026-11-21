import express from 'express';
import { pool } from '../../config/database.js';
import { clampLimit } from '../../utils/query.js';
import {
    IS_VISIBLE,
    JOIN_UNLOCKS_OF_PLAYER,
    LEADERBOARD,
    PLAYER_ID,
    UNLOCKS,
    parsePlayerId,
} from '../../utils/sql.js';
import { withSteamProfiles } from '../../utils/steam.js';

const router = express.Router();

router.get('/all', async (req, res) => {
    const search = typeof req.query.search === 'string'
        ? req.query.search.trim().toLowerCase().slice(0, 100)
        : '';
    const [rows] = await pool.query(`
        SELECT ${PLAYER_ID} AS userID, COUNT(u.achId) AS unlocked
        FROM Players p
        ${JOIN_UNLOCKS_OF_PLAYER}
        GROUP BY p.userID, p.authType
        ORDER BY p.userID ASC
    `);
    const players = await withSteamProfiles(rows);
    res.json(players.filter((player) =>
        player.userID.toLowerCase().includes(search) ||
        (player.userName ?? '').toLowerCase().includes(search)
    ));
});

router.get('/leaderboard', async (req, res) => {
    const limit = clampLimit(req.query.limit, 50, 100);
    const [rows] = await pool.query(LEADERBOARD, [limit]);
    res.json(await withSteamProfiles(rows));
});

router.get('/with-achievements', async (req, res) => {
    const [rows] = await pool.query(`
        SELECT DISTINCT ${PLAYER_ID} AS userID
        FROM Players p
        JOIN ${UNLOCKS} u ON u.aPlayer = p.userID AND u.aPlayerAuth = p.authType
        ORDER BY userID ASC
    `);
    res.json(await withSteamProfiles(rows));
});

router.get('/:userID', async (req, res) => {
    const id = parsePlayerId(req.params.userID);
    if (!id) return res.status(404).json({ error: 'Player not found' });
    const key = [id.userID, id.authType];

    const [playerRows] = await pool.query(`
        SELECT ${PLAYER_ID} AS userID
        FROM Players p
        WHERE p.userID = ? AND p.authType = ?
    `, key);

    if (playerRows.length === 0) return res.status(404).json({ error: 'Player not found' });

    const [achievements] = await pool.query(`
        SELECT
            u.achPlugin AS plugin, u.achId AS achievement_id,
            u.achDisplayName AS achName, u.achDescription AS description,
            u.hidden, u.obtained_at
        FROM ${UNLOCKS} u
        WHERE u.aPlayer = ? AND u.aPlayerAuth = ?
        ORDER BY u.obtained_at DESC
    `, key);

    const [inProgress] = await pool.query(`
        SELECT a.achPlugin AS plugin, a.achId AS achievement_id, pa.progress, a.target
        FROM PlayersAchievement pa
        JOIN Achievements a
            ON a.achId = pa.AchievementId AND a.achPlugin = pa.aAchievementPlugin
        WHERE pa.aPlayer = ? AND pa.aPlayerAuth = ?
            AND pa.progress > 0 AND pa.progress < a.target AND ${IS_VISIBLE}
    `, key);

    const [[totals]] = await pool.query(`
        SELECT
            (SELECT COUNT(*) FROM Achievements) AS total_achievements,
            (SELECT COUNT(*) + 1 FROM (
                SELECT 1 FROM ${UNLOCKS} u
                GROUP BY u.aPlayer, u.aPlayerAuth HAVING COUNT(*) > ?
            ) ahead) AS player_rank
    `, [achievements.length]);

    const total = Number(totals.total_achievements);
    const [player] = await withSteamProfiles(playerRows);

    res.json({
        ...player,
        unlocked: achievements.length,
        total_achievements: total,
        percent_completed: total > 0
            ? Math.round((achievements.length / total) * 10000) / 100
            : 0,
        rank: Number(totals.player_rank),
        achievements: achievements,
        in_progress: inProgress,
    });
});

export default router;
