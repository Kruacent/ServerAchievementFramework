import express from 'express';
import { pool } from '../../config/database.js';
import { clampLimit } from '../../utils/query.js';
import {
    ACHIEVEMENT_COLUMNS,
    IS_VISIBLE,
    JOIN_UNLOCKS_OF_ACHIEVEMENT,
    PERCENT_OF_PLAYERS,
    PLAYER_ID,
    UNLOCKS,
    parsePlayerId,
} from '../../utils/sql.js';
import { withSteamProfiles } from '../../utils/steam.js';

const router = express.Router();

const ACHIEVEMENT_WITH_STATS = `
    SELECT
        ${ACHIEVEMENT_COLUMNS},
        COUNT(u.aPlayer) AS players_count,
        ${PERCENT_OF_PLAYERS} AS percent_completed
    FROM Achievements a
    ${JOIN_UNLOCKS_OF_ACHIEVEMENT}
`;

router.get('/all', async (req, res) => {
    const [rows] = await pool.query(`
        ${ACHIEVEMENT_WITH_STATS}
        WHERE ${IS_VISIBLE}
        GROUP BY a.achId, a.achPlugin
        ORDER BY a.achPlugin ASC, a.achDisplayName ASC
    `);
    res.json(rows);
});

// Latest unlocks, all players combined. Hidden achievements stay anonymous.
router.get('/recent', async (req, res) => {
    const limit = clampLimit(req.query.limit, 20, 50);
    const [rows] = await pool.query(`
        SELECT
            ${PLAYER_ID} AS userID, u.hidden, u.obtained_at,
            CASE WHEN u.hidden = 1 THEN NULL ELSE u.achPlugin END AS plugin,
            CASE WHEN u.hidden = 1 THEN NULL ELSE u.achId END AS achievement_id,
            CASE WHEN u.hidden = 1 THEN '[REDACTED]' ELSE u.achDisplayName END AS achName
        FROM ${UNLOCKS} u
        JOIN Players p ON p.userID = u.aPlayer AND p.authType = u.aPlayerAuth
        ORDER BY u.obtained_at DESC
        LIMIT ?
    `, [limit]);
    res.json(await withSteamProfiles(rows));
});

// Visible achievements unlocked by one player.
router.get('/player/:userID', async (req, res) => {
    const player = parsePlayerId(req.params.userID);
    if (!player) return res.json([]);
    const [rows] = await pool.query(`
        SELECT
            u.achPlugin AS plugin, u.achId AS achievement_id,
            u.achDisplayName AS achName, u.achDescription AS description,
            u.hidden, u.obtained_at
        FROM ${UNLOCKS} u
        WHERE u.aPlayer = ? AND u.aPlayerAuth = ? AND u.hidden = 0
        ORDER BY u.obtained_at DESC
    `, [player.userID, player.authType]);
    res.json(rows);
});

// Must stay last: it would otherwise swallow /player/...
router.get('/:plugin/:achievementId', async (req, res) => {
    const key = [req.params.achievementId, req.params.plugin];
    const [rows] = await pool.query(`
        ${ACHIEVEMENT_WITH_STATS}
        WHERE a.achId = ? AND a.achPlugin = ? AND ${IS_VISIBLE}
        GROUP BY a.achId, a.achPlugin
    `, key);

    if (rows.length === 0) return res.status(404).json({ error: 'Achievement not found' });

    const [players] = await pool.query(`
        SELECT ${PLAYER_ID} AS userID, u.obtained_at
        FROM ${UNLOCKS} u
        JOIN Players p ON p.userID = u.aPlayer AND p.authType = u.aPlayerAuth
        WHERE u.achId = ? AND u.achPlugin = ?
        ORDER BY u.obtained_at DESC
    `, key);

    res.json({ ...rows[0], players: await withSteamProfiles(players) });
});

export default router;
