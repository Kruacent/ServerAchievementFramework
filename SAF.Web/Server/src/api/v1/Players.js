import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT userID, userName, created_at, updated_at
            FROM Players
            ORDER BY userName ASC
        `);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des joueurs' });
    }
});

function redactText() {
    const phrases = [
        "Spend a full minute near a [REDACTED] without panicking.",
        "Be the first to reach the [REDACTED] this round.",
        "Survive a [REDACTED] encounter alone.",
        "Activate all [REDACTED] while avoiding detection.",
        "Escape the [REDACTED] without any teammates.",
        "Interact with the [REDACTED] in complete darkness.",
        "Complete a [REDACTED] task under unusual conditions.",
        "Discover a [REDACTED] without triggering alarms.",
        "Witness the [REDACTED] event without dying.",
        "Reach the [REDACTED] area before anyone else."
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
}

router.get('/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        const [playerRows] = await pool.query(`
            SELECT userID, userName, created_at, updated_at
            FROM Players
            WHERE userID = ?
        `, [userID]);

        if (playerRows.length === 0) 
            return res.status(404).json({ error: 'Joueur non trouvé' });

        const player = playerRows[0];

        const [achievements] = await pool.query(`
            SELECT a.achievement_id, a.achName, a.description, a.hidden, pa.obtained_at
            FROM PlayersAchievements pa
            JOIN Achievements a ON pa.achievement_id = a.achievement_id
            WHERE pa.userID = ?
            ORDER BY pa.obtained_at DESC
        `, [userID]);

        player.achievements = achievements.map(a => {
            if (a.hidden) {
                return {
                    achievement_id: Math.floor(Math.random() * 1e9 + 1e8),
                    achName: '[REDACTED]',
                    description: redactText(),
                    hidden: 1,
                    obtained_at: a.obtained_at
                };
            }
            return a;
        });

        res.status(200).json(player);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération du joueur' });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.userID, 
                p.userName,
                COUNT(pa.achievement_id) AS unlocked,
                (COUNT(pa.achievement_id) / (SELECT COUNT(*) FROM Achievements)) * 100 AS percent_completed
            FROM Players p
            LEFT JOIN PlayersAchievements pa ON p.userID = pa.userID
            GROUP BY p.userID
            ORDER BY percent_completed DESC
            LIMIT 50
        `);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération du leaderboard' });
    }
});

router.get('/with-achievements', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT p.userID, p.userName
            FROM Players p
            JOIN PlayersAchievements pa ON p.userID = pa.userID
            ORDER BY p.userName ASC
        `);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des joueurs avec achievements' });
    }
});

export default router;