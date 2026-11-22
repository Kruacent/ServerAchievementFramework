export type Formatters = {
  number: (value: number) => string;
  percent: (value: number) => string;
};

/** Every string of the site, in French. `en.ts` must keep the same shape. */
export const fr = (f: Formatters) => {
  const s = (n: number) => (n > 1 ? "s" : "");
  return {
    siteName: "Server Achievement Framework",
    siteDescription: "Succès du serveur, progression des joueurs et classement.",
    nav: { achievements: "Succès", leaderboard: "Classement", players: "Joueurs" },
    language: "Langue",
    noDescription: "Aucune description.",
    hiddenCount: (n: number) => `${f.number(n)} succès caché${s(n)}`,
    hiddenDescription: "Leur nom et leur description restent secrets.",
    hiddenName: "Succès caché",
    ofPlayers: (percent: number) => `${f.percent(percent)} des joueurs`,
    playerCount: (n: number) => `${f.number(n)} joueur${s(n)}`,
    home: {
      title: "Succès du serveur",
      summary: (players: number, unlocks: number, average: number) =>
        `${f.number(players)} joueur${s(players)}, ${f.number(unlocks)} déblocage${s(unlocks)}, ${f.percent(average)} de complétion moyenne.`,
      count: (n: number) => `${f.number(n)} succès`,
      percentColumn: "% des joueurs",
      topPlayers: "Meilleurs joueurs",
      seeAll: "Tout voir",
      nobodyYet: "Personne n’a encore débloqué de succès.",
      recent: "Derniers déblocages",
      noRecent: "Aucun déblocage pour le moment.",
      aHidden: "un succès caché",
    },
    browser: {
      search: "Rechercher un succès",
      category: "Catégorie",
      allCategories: "Toutes les catégories",
      sort: "Tri",
      sortCommon: "Les plus obtenus",
      sortRare: "Les plus rares",
      sortName: "Nom (A-Z)",
      empty: "Aucun succès n’est encore enregistré.",
      noMatch: "Aucun succès ne correspond à ces filtres.",
    },
    leaderboard: {
      title: "Classement",
      intro: (total: number) =>
        `Joueurs classés par nombre de succès débloqués, sur ${f.number(total)} disponibles.`,
      player: "Joueur",
      achievements: "Succès",
      progress: "Progression",
      lastUnlock: "Dernier déblocage",
      empty: "Aucun joueur enregistré pour le moment.",
    },
    players: {
      title: "Joueurs",
      placeholder: "Pseudo ou identifiant",
      searchLabel: "Rechercher un joueur",
      search: "Rechercher",
      resultsFor: (n: number, query: string) =>
        `${f.number(n)} résultat${s(n)} pour « ${query} »`,
      unlocked: (n: number) => `${f.number(n)} succès débloqué${s(n)}`,
      noMatch: "Aucun joueur ne correspond à cette recherche.",
      empty: "Aucun joueur enregistré.",
    },
    profile: {
      notFound: "Joueur introuvable",
      rank: (n: number) => `Rang ${f.number(n)}`,
      progress: (unlocked: number, total: number) => `${unlocked} sur ${total}`,
      unlocked: (n: number) => `Débloqués (${n})`,
      remaining: (n: number) => `Restants (${n})`,
      unlockedOn: "Débloqué le",
      none: "Ce joueur n’a encore débloqué aucun succès.",
    },
    achievement: {
      notFound: "Succès introuvable",
      back: "Tous les succès",
      share: "des joueurs ont ce succès",
      unlockedBy: (n: number) => `Débloqué par ${f.number(n)} joueur${s(n)}`,
      nobody: "Personne n’a encore débloqué ce succès.",
    },
    error: {
      title: "Impossible de charger les données",
      body: "L’API des succès ne répond pas ou a renvoyé une erreur. Vérifie que le serveur (SAF.Web/Server) est démarré et que la base de données est joignable.",
      retry: "Réessayer",
    },
    notFound: {
      title: "Page introuvable",
      body: "Ce joueur ou ce succès n’existe pas (ou plus).",
      back: "Retour aux succès",
    },
    loading: "Chargement…",
    justNow: "à l’instant",
  };
};

export type Dictionary = ReturnType<typeof fr>;
