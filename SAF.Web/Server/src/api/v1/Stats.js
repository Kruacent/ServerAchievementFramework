import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

router.get('/achievements-percentage', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                a.achievement_id,
                a.achName,
                COUNT(pa.userID) AS players_count,
                ROUND(COUNT(pa.userID) / (SELECT COUNT(*) FROM Players) * 100, 2) AS percent_completed
            FROM Achievements a
            LEFT JOIN PlayersAchievements pa ON a.achievement_id = pa.achievement_id
            GROUP BY a.achievement_id
            ORDER BY percent_completed DESC
        `);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des stats d\'achievements' });
    }
});

router.get('/total-players', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT COUNT(*) AS total_players FROM Players
        `);
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération du nombre total de joueurs' });
    }
});

router.get('/leaderboard-global', async (req, res) => {
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
        res.status(500).json({ error: 'Erreur lors de la récupération du leaderboard global' });
    }
});

export default router;