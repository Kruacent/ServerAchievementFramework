import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT category_id, name, description
            FROM AchievementCategories
            ORDER BY name ASC
        `);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
    }
});

router.get('/:categoryId', async (req, res) => {
    const { categoryId } = req.params;

    try {
        const [categoryRows] = await pool.query(`
            SELECT category_id, name, description
            FROM AchievementCategories
            WHERE category_id = ?
        `, [categoryId]);

        if (categoryRows.length === 0) return res.status(404).json({ error: 'Catégorie non trouvée' });

        const category = categoryRows[0];

        const [achievements] = await pool.query(`
            SELECT achievement_id, achName, description, hidden
            FROM Achievements
            WHERE category_id = ?
            ORDER BY achievement_id ASC
        `, [categoryId]);

        category.achievements = achievements;

        res.status(200).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération de la catégorie' });
    }
});

export default router;