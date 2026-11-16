import './config/env.js';
import express from 'express';
import cors from 'cors';

import { pool } from './config/database.js';
import achievementEndpoint from './api/v1/Achievement.js';
import achievementCategoryEndpoint from './api/v1/AchievementCategory.js';
import playerEndpoint from './api/v1/Players.js';
import statsEndpoint from './api/v1/Stats.js';

const port = Number(process.env.SERVER_PORT) || 5000;

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const log = (message) => console.log(`[${new Date().toISOString()}] ${message}`);

const app = express();
app.disable('x-powered-by');

app.use(cors({ origin: allowedOrigins, methods: ['GET'] }));

app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
  });
  log(`${req.method} ${req.originalUrl} from ${req.ip}`);
  next();
});

app.use('/v1/achievement', achievementEndpoint);
app.use('/v1/achievement-category', achievementCategoryEndpoint);
app.use('/v1/players', playerEndpoint);
app.use('/v1/stats', statsEndpoint);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function logDatabaseStatus() {
  const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER } = process.env;
  const target = `'${DB_DATABASE}' at ${DB_HOST}:${DB_PORT} as '${DB_USER}'`;
  try {
    await pool.query('SELECT 1');
    log(`Connected to database ${target}`);
  } catch (err) {
    log(`Database unreachable (${target}): ${err.code ?? err.message}`);
  }
}

app.listen(port, () => {
  log(`API listening on port ${port}`);
  logDatabaseStatus();
});
