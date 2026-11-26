const ENDPOINT = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/';
const MAX_IDS_PER_REQUEST = 100;
const CACHE_MS = 60 * 60 * 1000;
const RETRY_MS = 60 * 1000;
const TIMEOUT_MS = 4000;

const NO_PROFILE = { userName: null, avatar: null };

const cache = new Map();

/** "76561198000000000@steam" -> "76561198000000000"; null for other account types. */
function steamIdOf(userID) {
    const match = /^(\d{17})@steam$/i.exec(userID);
    return match ? match[1] : null;
}

function remember(steamId, profile, ttl) {
    cache.set(steamId, { profile, expires: Date.now() + ttl });
}

async function fetchProfiles(steamIds) {
    const url = new URL(ENDPOINT);
    url.searchParams.set('key', process.env.STEAM_API_KEY);
    url.searchParams.set('steamids', steamIds.join(','));

    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const { response: { players } } = await response.json();

        // Steam omits IDs it does not know: remember those as profile-less too.
        for (const steamId of steamIds) remember(steamId, NO_PROFILE, CACHE_MS);
        for (const player of players) {
            remember(player.steamid, {
                userName: player.personaname || null,
                avatar: player.avatarmedium || null,
            }, CACHE_MS);
        }
    } catch (err) {
        console.error(`Steam profiles unavailable: ${err.message}`);
        for (const steamId of steamIds) remember(steamId, NO_PROFILE, RETRY_MS);
    }
}

async function refresh(steamIds) {
    const stale = [...new Set(steamIds)].filter((steamId) => {
        const entry = cache.get(steamId);
        return !entry || entry.expires < Date.now();
    });

    const batches = [];
    for (let i = 0; i < stale.length; i += MAX_IDS_PER_REQUEST) {
        batches.push(fetchProfiles(stale.slice(i, i + MAX_IDS_PER_REQUEST)));
    }
    await Promise.all(batches);
}

export const steamEnabled = () => Boolean(process.env.STEAM_API_KEY);

export async function withSteamProfiles(rows) {
    const steamIds = rows.map((row) => steamIdOf(row.userID));
    if (steamEnabled()) await refresh(steamIds.filter(Boolean));

    return rows.map((row, index) => ({
        ...row,
        ...(cache.get(steamIds[index])?.profile ?? NO_PROFILE),
    }));
}
