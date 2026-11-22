import type { Dictionary, Formatters } from "./fr";

export const en = (f: Formatters): Dictionary => {
  const s = (n: number) => (n === 1 ? "" : "s");
  return {
    siteName: "Server Achievement Framework",
    siteDescription: "Server achievements, player progress and leaderboard.",
    nav: { achievements: "Achievements", leaderboard: "Leaderboard", players: "Players" },
    language: "Language",
    noDescription: "No description.",
    hiddenCount: (n) => `${f.number(n)} hidden achievement${s(n)}`,
    hiddenDescription: "Their names and descriptions stay secret.",
    hiddenName: "Hidden achievement",
    ofPlayers: (percent) => `${f.percent(percent)} of players`,
    playerCount: (n) => `${f.number(n)} player${s(n)}`,
    home: {
      title: "Server achievements",
      summary: (players, unlocks, average) =>
        `${f.number(players)} player${s(players)}, ${f.number(unlocks)} unlock${s(unlocks)}, ${f.percent(average)} average completion.`,
      count: (n) => `${f.number(n)} achievement${s(n)}`,
      percentColumn: "% of players",
      topPlayers: "Top players",
      seeAll: "See all",
      nobodyYet: "Nobody has unlocked an achievement yet.",
      recent: "Latest unlocks",
      noRecent: "No unlocks yet.",
      aHidden: "a hidden achievement",
    },
    browser: {
      search: "Search achievements",
      category: "Category",
      allCategories: "All categories",
      sort: "Sort",
      sortCommon: "Most unlocked",
      sortRare: "Rarest",
      sortName: "Name (A-Z)",
      empty: "No achievements have been registered yet.",
      noMatch: "No achievements match these filters.",
    },
    leaderboard: {
      title: "Leaderboard",
      intro: (total) =>
        `Players ranked by number of unlocked achievements, out of ${f.number(total)}.`,
      player: "Player",
      achievements: "Achievements",
      progress: "Progress",
      lastUnlock: "Last unlock",
      empty: "No players registered yet.",
    },
    players: {
      title: "Players",
      placeholder: "Name or ID",
      searchLabel: "Search players",
      search: "Search",
      resultsFor: (n, query) => `${f.number(n)} result${s(n)} for “${query}”`,
      unlocked: (n) => `${f.number(n)} unlocked`,
      noMatch: "No players match this search.",
      empty: "No players registered.",
    },
    profile: {
      notFound: "Player not found",
      rank: (n) => `Rank ${f.number(n)}`,
      progress: (unlocked, total) => `${unlocked} of ${total}`,
      unlocked: (n) => `Unlocked (${n})`,
      remaining: (n) => `Remaining (${n})`,
      unlockedOn: "Unlocked",
      none: "This player has not unlocked any achievement yet.",
    },
    achievement: {
      notFound: "Achievement not found",
      back: "All achievements",
      share: "of players have this achievement",
      unlockedBy: (n) => `Unlocked by ${f.number(n)} player${s(n)}`,
      nobody: "Nobody has unlocked this achievement yet.",
    },
    error: {
      title: "Could not load the data",
      body: "The achievements API is not responding or returned an error. Check that the server (SAF.Web/Server) is running and that the database is reachable.",
      retry: "Try again",
    },
    notFound: {
      title: "Page not found",
      body: "This player or achievement does not exist (anymore).",
      back: "Back to achievements",
    },
    loading: "Loading…",
    justNow: "just now",
  };
};
