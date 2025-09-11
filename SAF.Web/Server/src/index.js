import express from 'express';
import dotenv from 'dotenv';
import { getTimestamp } from './utils/date.js';
import cors from 'cors';
import path from 'path';

import achievementEndpoint from '../src/api/v1/Achievement.js';
import playerEndpoint from '../src/api/v1/Players.js';
import achievementCategoryEndpoint from '../src/api/v1/AchievementCategory.js';
import statsEndpoint from '../src/api/v1/Stats.js';

// Load environment variables from .env file
dotenv.config({ path: path.resolve('../.env') });

// Initialize the Express application
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:3000"];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("CORS error: Origin not allowed -", origin);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

app.use(cors(corsOptions));

const port = process.env.SERVER_PORT;
console.log(port)

/**
 * Middleware to parse incoming JSON requests
 */
app.use(express.json());

/**
 * Middleware to log details of incoming requests such as IP, HTTP method, and URL
 */
app.use((req, res, next) => {
  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    req.socket.remoteAddress;

  const { method, originalUrl } = req;
  console.log(`[${method}] request from ${ip} to ${originalUrl}`);
  next();
});

/**
 * Route handlers for different resources
 * - Achievements routes
 */
app.use('/v1/achievement/', achievementEndpoint);
app.use('/v1/achievement-category/', achievementCategoryEndpoint);
app.use('/v1/players/', playerEndpoint);
app.use('/v1/stats/', statsEndpoint);

/**
 * Start the server and log connection details
 */
const server = app.listen(port, async () => {
    console.log(`${getTimestamp()} Started new session on port ${port}`)
    console.log(`${getTimestamp()} Connecting to database host: ${process.env.DB_HOST}:${process.env.DB_PORT}`)
    console.log(`${getTimestamp()} Database found: ${process.env.DB_DATABASE}`)
    console.log(`${getTimestamp()} User '${process.env.DB_USER}' connected to database`)
});