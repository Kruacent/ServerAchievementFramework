import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                a.achievement_id, a.achName, a.description, a.hidden,
                c.name AS category,
                COUNT(pa.userID) AS players_count,
                ROUND(COUNT(pa.userID) / (SELECT COUNT(*) FROM Players) * 100, 2) AS percent_completed
            FROM Achievements a
            LEFT JOIN AchievementCategories c ON a.category_id = c.category_id
            LEFT JOIN PlayersAchievements pa ON a.achievement_id = pa.achievement_id
            WHERE a.hidden = 0
            GROUP BY a.achievement_id
            ORDER BY a.achievement_id ASC
        `);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des achievements' });
    }
});

router.get('/:achievementId', async (req, res) => {
    const { achievementId } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT a.achievement_id, a.achName, a.description, a.hidden, c.name AS category
            FROM Achievements a
            LEFT JOIN AchievementCategories c ON a.category_id = c.category_id
            WHERE a.achievement_id = ?
        `, [achievementId]);

        if (rows.length === 0) return res.status(404).json({ error: 'Achievement non trouvé' });

        const [players] = await pool.query(`
            SELECT p.userID, p.userName, pa.obtained_at
            FROM PlayersAchievements pa
            JOIN Players p ON pa.userID = p.userID
            WHERE pa.achievement_id = ?
        `, [achievementId]);

        const achievement = rows[0];
        achievement.players = players;

        res.status(200).json(achievement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'achievement' });
    }
});

router.get('/category/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT a.achievement_id, a.achName, a.description, a.hidden
            FROM Achievements a
            WHERE a.category_id = ?
            ORDER BY a.achievement_id ASC
        `, [categoryId]);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des achievements par catégorie' });
    }
});

router.get('/player/:userID', async (req, res) => {
    const { userID } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT a.achievement_id, a.achName, a.description, a.hidden, pa.obtained_at
            FROM PlayersAchievements pa
            JOIN Achievements a ON pa.achievement_id = a.achievement_id
            WHERE pa.userID = ?
            ORDER BY pa.obtained_at DESC
        `, [userID]);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des achievements du joueur' });
    }
});

router.get('/recent', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT pa.userID, p.userName, a.achievement_id, a.achName, pa.obtained_at
            FROM PlayersAchievements pa
            JOIN Players p ON pa.userID = p.userID
            JOIN Achievements a ON pa.achievement_id = a.achievement_id
            ORDER BY pa.obtained_at DESC
            LIMIT 20
        `);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des derniers succès' });
    }
});

export default router;