"use client";

import { useMemo, useState } from "react";
import type { Achievement } from "@/utils/api";
import {
  categoriesOf,
  filterAchievements,
  isFiltering,
  noFilters,
  type Filters,
  type Sort,
} from "@/utils/filterAchievements";
import { achievementHref, achievementKey } from "@/utils/format";
import { useI18n } from "./I18nProvider";
import { AchievementRow, emptyClass, fieldClass } from "./ui";

const selectClass = `${fieldClass} min-w-0 flex-1 sm:flex-none`;

export function AchievementBrowser({
  achievements,
  hiddenCount,
}: {
  achievements: Achievement[];
  hiddenCount: number;
}) {
  const { t, locale, percent } = useI18n();
  const [filters, setFilters] = useState(noFilters);
  const set = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch });

  const categories = useMemo(() => categoriesOf(achievements), [achievements]);
  const visible = useMemo(
    () => filterAchievements(achievements, filters, locale),
    [achievements, filters, locale],
  );
  const showHidden = hiddenCount > 0 && !isFiltering(filters);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="search"
          value={filters.query}
          onChange={(event) => set({ query: event.target.value })}
          placeholder={t.browser.search}
          aria-label={t.browser.search}
          className={`${fieldClass} w-full sm:w-auto sm:flex-1`}
        />
        {categories.length > 0 && (
          <select
            value={filters.category}
            onChange={(event) => set({ category: event.target.value })}
            aria-label={t.browser.category}
            className={selectClass}
          >
            <option value="">{t.browser.allCategories}</option>
            {categories.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        )}
        <select
          value={filters.sort}
          onChange={(event) => set({ sort: event.target.value as Sort })}
          aria-label={t.browser.sort}
          className={selectClass}
        >
          <option value="common">{t.browser.sortCommon}</option>
          <option value="rare">{t.browser.sortRare}</option>
          <option value="name">{t.browser.sortName}</option>
        </select>
      </div>

      {visible.length === 0 && !showHidden ? (
        <p className={emptyClass}>
          {achievements.length === 0 ? t.browser.empty : t.browser.noMatch}
        </p>
      ) : (
        <ul className="space-y-1">
          {visible.map((achievement) => (
            <li key={achievementKey(achievement)}>
              <AchievementRow
                name={achievement.achName}
                description={achievement.description || t.noDescription}
                percent={achievement.percent_completed}
                href={achievementHref(achievement)}
                meta={`${t.playerCount(achievement.players_count)} · ${achievement.category}`}
                aside={
                  <span className="shrink-0 tabular-nums text-ink">
                    {percent(achievement.percent_completed)}
                  </span>
                }
              />
            </li>
          ))}
          {showHidden && (
            <li>
              <AchievementRow
                name={t.hiddenCount(hiddenCount)}
                description={t.hiddenDescription}
                state="hidden"
                dimmed
              />
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
