# ServerAchievementFramework
Create achievement for your server

## Achievements website

| Image              | What it is                       |
| ------------------ | -------------------------------- |
| `kruacent/saf-db`  | MySQL 8.4 with the tables ready  |
| `kruacent/saf-api` | the API                     |
| `kruacent/saf-web` | the website                      |

### Install

Requires [Docker](https://docs.docker.com/engine/install/)

```bash
mkdir saf && cd saf
curl -O https://raw.githubusercontent.com/Kruacent/ServerAchievementFramework/main/SAF.Web/docker-compose.yml
curl -o .env https://raw.githubusercontent.com/Kruacent/ServerAchievementFramework/main/SAF.Web/env.example
```

Edit `.env` and replace the `change-me` passwords **before the first start**: they are
only applied when the database is created.

Then download the images and start everything:

```bash
docker compose pull
docker compose up -d
```

The site is on <http://localhost:3000> (`WEB_PORT` in `.env`).

### Update

In the same folder:

```bash
docker compose pull
docker compose up -d
```

The data is kept: it lives in the Docker volume `saf_db-data`. Only
`docker compose down -v` deletes it.

### Settings (`.env`)

| Variable | Purpose |
| --- | --- |
| `DB_ROOT_PASSWORD`, `DB_DATABASE`, `DB_USER`, `DB_PASSWORD` | Database name and accounts. The game plugin connects with `DB_USER` / `DB_PASSWORD`. |
| `STEAM_API_KEY` | Optional. Shows Steam names and avatars ([get a key](https://steamcommunity.com/dev/apikey)). |
| `WEB_PORT` | Port of the website. |
| `DB_BIND`, `DB_PORT`, `API_BIND`, `API_PORT` | Where MySQL and the API listen. `127.0.0.1` = this machine only, `0.0.0.0` = reachable from other machines. |
| `SAF_TAG` | Image version: `latest`, or a commit hash to pin one. |

If the game server runs on another machine, set `DB_BIND=0.0.0.0` and point the plugin
at this machine's IP, port `3306`, with `DB_USER` / `DB_PASSWORD`.

### Everyday commands

```bash
docker compose logs -f   # follow the logs
docker compose down      # stop (data kept)
```

### Build the images yourself

From `SAF.Web`, to test local changes without Docker Hub :

```bash
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
```
