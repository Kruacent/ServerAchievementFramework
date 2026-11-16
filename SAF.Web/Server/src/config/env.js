import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

// Resolved from this file, not from the working directory, so the server can
// be started from anywhere. Variables already set (Docker) take precedence.
dotenv.config({
  path: fileURLToPath(new URL('../../.env', import.meta.url)),
  quiet: true,
});
