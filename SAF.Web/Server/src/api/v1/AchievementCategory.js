import express from 'express';
import { pool } from '../../config/database.js';
import { ACHIEVEMENT_COLUMNS, IS_VISIBLE } from '../../utils/sql.js';

const router = express.Router();

router.get('/all', async (req, res) => {
    const [rows] = await pool.query(`
        SELECT a.achPlugin AS category_id, a.achPlugin AS name,
            COUNT(*) AS achievements_count
        FROM Achievements a
        WHERE ${IS_VISIBLE}
        GROUP BY a.achPlugin
        ORDER BY a.achPlugin ASC
    `);
    res.json(rows);
});

router.get('/:categoryId', async (req, res) => {
    const [achievements] = await pool.query(`
        SELECT ${ACHIEVEMENT_COLUMNS}
        FROM Achievements a
        WHERE a.achPlugin = ? AND ${IS_VISIBLE}
        ORDER BY a.achDisplayName ASC
    `, [req.params.categoryId]);

    if (achievements.length === 0) return res.status(404).json({ error: 'Category not found' });

    const name = achievements[0].plugin;
    res.json({ category_id: name, name, achievements });
});

export default router;
