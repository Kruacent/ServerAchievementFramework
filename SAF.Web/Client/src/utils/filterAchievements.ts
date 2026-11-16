import type { Achievement } from "./api";

export type Sort = "common" | "rare" | "name";
export type Filters = { query: string; category: string; sort: Sort };

export const noFilters: Filters = { query: "", category: "", sort: "common" };

export const isFiltering = ({ query, category }: Filters) =>
  query.trim() !== "" || category !== "";

export function categoriesOf(achievements: Achievement[]) {
  const names = achievements.map((a) => a.category).filter((name) => name !== null);
  return [...new Set(names)].sort();
}

function matches(achievement: Achievement, { query, category }: Filters) {
  if (category && achievement.category !== category) return false;
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    achievement.achName.toLowerCase().includes(needle) ||
    (achievement.description ?? "").toLowerCase().includes(needle)
  );
}

function comparator(sort: Sort, locale: string) {
  return (a: Achievement, b: Achievement) => {
    if (sort === "name") return a.achName.localeCompare(b.achName, locale);
    const diff = a.percent_completed - b.percent_completed;
    return sort === "rare" ? diff : -diff;
  };
}

export function filterAchievements(
  achievements: Achievement[],
  filters: Filters,
  locale: string,
) {
  return achievements
    .filter((achievement) => matches(achievement, filters))
    .sort(comparator(filters.sort, locale));
}
