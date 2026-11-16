import express from 'express';
import { pool } from '../../config/database.js';
import {
    IS_VISIBLE,
    JOIN_UNLOCKS_OF_ACHIEVEMENT,
    PERCENT_OF_PLAYERS,
    UNLOCKS,
} from '../../utils/sql.js';

const router = express.Router();

router.get('/achievements-percentage', async (req, res) => {
    const [rows] = await pool.query(`
        SELECT
            a.achPlugin AS plugin,
            a.achId AS achievement_id,
            a.achDisplayName AS achName,
            COUNT(u.aPlayer) AS players_count,
            ${PERCENT_OF_PLAYERS} AS percent_completed
        FROM Achievements a
        ${JOIN_UNLOCKS_OF_ACHIEVEMENT}
        WHERE ${IS_VISIBLE}
        GROUP BY a.achId, a.achPlugin
        ORDER BY percent_completed DESC
    `);
    res.json(rows);
});

router.get('/overview', async (req, res) => {
    const [[row]] = await pool.query(`
        SELECT
            (SELECT COUNT(*) FROM Players) AS total_players,
            (SELECT COUNT(*) FROM Achievements) AS total_achievements,
            (SELECT COUNT(*) FROM Achievements WHERE hidden = 1) AS hidden_achievements,
            (SELECT COUNT(*) FROM ${UNLOCKS} u) AS total_unlocks
    `);
    const possible = Number(row.total_players) * Number(row.total_achievements);
    res.json({
        ...row,
        average_completion: possible > 0
            ? Math.round((Number(row.total_unlocks) / possible) * 10000) / 100
            : 0,
    });
});

export default router;
