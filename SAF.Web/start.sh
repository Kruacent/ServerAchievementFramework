#!/bin/sh
set -e
cd "$(dirname "$0")"

if ! command -v docker >/dev/null 2>&1; then
    echo "Docker is required: https://docs.docker.com/engine/install/" >&2
    exit 1
fi

if [ ! -f .env ]; then
    cp env.example .env
    echo "Created .env from env.example."
fi

docker compose pull
docker compose up -d

echo
echo "The site is starting on http://localhost:3000 (WEB_PORT in .env)."
echo "Stop it with: docker compose down"
