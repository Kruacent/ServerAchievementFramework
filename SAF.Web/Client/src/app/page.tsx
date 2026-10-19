"use client";

import { useCallback, useEffect, useState } from "react";

type Achievement = {
  achievement_id: number;
  achName: string;
  description: string | null;
  category: string | null;
  players_count: number | string;
  percent_completed: number | string | null;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function Home() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const loadAchievements = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/v1/achievement/all`, { signal });
      if (!response.ok) {
        throw new Error(`Le serveur a répondu avec le statut ${response.status}.`);
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("La réponse de l’API n’est pas une liste d’achievements.");
      }

      setAchievements(data as Achievement[]);
    } catch (fetchError) {
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return;
      }

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Une erreur inconnue est survenue.",
      );
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadAchievements(controller.signal);

    return () => controller.abort();
  }, [loadAchievements, reloadKey]);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
            Server Achievement Framework
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Achievements
          </h1>
          <p className="mt-2 text-zinc-600">
            Liste récupérée depuis l’API du serveur.
          </p>
        </header>

        {isLoading && (
          <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600">
            Chargement des achievements…
          </p>
        )}

        {!isLoading && error && (
          <section
            aria-live="polite"
            className="rounded-xl border border-red-200 bg-white p-6"
          >
            <h2 className="font-semibold text-red-800">
              Impossible de charger les achievements
            </h2>
            <p className="mt-2 text-sm text-zinc-600">{error}</p>
            <p className="mt-2 text-sm text-zinc-600">
              Vérifie que l’API est démarrée sur {apiUrl}, ou définis{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5">
                NEXT_PUBLIC_API_URL
              </code>
              .
            </p>
            <button
              className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
              onClick={() => setReloadKey((key) => key + 1)}
              type="button"
            >
              Réessayer
            </button>
          </section>
        )}

        {!isLoading && !error && achievements.length === 0 && (
          <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600">
            Aucun achievement à afficher.
          </p>
        )}

        {!isLoading && !error && achievements.length > 0 && (
          <>
            <p className="mb-4 text-sm text-zinc-600">
              {achievements.length} achievement
              {achievements.length > 1 ? "s" : ""}
            </p>
            <ul className="space-y-3">
              {achievements.map((achievement) => (
                <li
                  className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
                  key={achievement.achievement_id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {achievement.achName}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-600">
                        {achievement.description || "Aucune description."}
                      </p>
                    </div>
                    {achievement.category && (
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-800">
                        {achievement.category}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-xs text-zinc-500">
                    Débloqué par {achievement.players_count} joueur
                    {Number(achievement.players_count) > 1 ? "s" : ""}
                    {achievement.percent_completed !== null &&
                      ` · ${achievement.percent_completed}% des joueurs`}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
