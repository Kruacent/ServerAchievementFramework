import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

router.get('/test', async (req, res) => {
    console.log("Achievement endpoint test successful");
    res.status(200).json({ message: "Achievement endpoint test successful" });
});

export default router;