import Link from "next/link";
import type { ReactNode } from "react";
import type { PlayerRef } from "@/utils/api";
import { displayName, playerHref } from "@/utils/format";

export const titleClass = "text-3xl font-semibold tracking-tight text-ink sm:text-4xl";
export const sectionTitleClass = "mb-4 font-medium text-ink";
export const emptyClass = "py-8 text-muted";
export const buttonClass =
  "cursor-pointer rounded-md bg-ink px-4 py-2 text-sm font-medium text-page hover:bg-body";
export const fieldClass =
  "rounded-md border border-line bg-page px-3 py-2 text-sm text-ink placeholder:text-muted hover:border-[#cfcfc8]";
export const hoverUnderline = "underline-offset-4 hover:underline";

export type TrophyState = "unlocked" | "locked" | "hidden";

const trophyColor: Record<TrophyState, string> = {
  unlocked: "text-ink",
  locked: "text-[#c9c9c2]",
  hidden: "text-muted",
};

export function Trophy({
  state = "unlocked",
  size = 28,
}: {
  state?: TrophyState;
  size?: number;
}) {
  const classes = `shrink-0 ${trophyColor[state]}`;

  if (state === "hidden") {
    return (
      <span
        aria-hidden
        className={`grid place-items-center font-medium ${classes}`}
        style={{ width: size, height: size, fontSize: size * 0.7, lineHeight: 1 }}
      >
        ?
      </span>
    );
  }

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={classes}
    >
      <path
        fillRule="evenodd"
        d="M6 3h12v2h3v3a4 4 0 0 1-4 4h-.35A6 6 0 0 1 13 14.9V18h3v3H8v-3h3v-3.1A6 6 0 0 1 7.35 12H7a4 4 0 0 1-4-4V5h3V3Zm0 4H5v1c0 .8.47 1.5 1.2 1.83A6 6 0 0 1 6 8.5V7Zm12 0v1.5c0 .46-.07.9-.2 1.33.73-.33 1.2-1.03 1.2-1.83V7h-1Z"
      />
    </svg>
  );
}

export function Avatar({ player, size = 28 }: { player: PlayerRef; size?: number }) {
  if (player.avatar) {
    return (
      <img
        src={player.avatar}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        className="shrink-0 rounded-full bg-fill"
      />
    );
  }

  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full bg-fill text-muted"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="8" r="4.5" />
        <path d="M3.5 21a8.5 8.5 0 0 1 17 0Z" />
      </svg>
    </span>
  );
}

export function PlayerLink({ player }: { player: PlayerRef }) {
  return (
    <Link
      href={playerHref(player.userID)}
      className="group flex min-w-0 items-center gap-3 text-ink"
    >
      <Avatar player={player} />
      <span className="truncate tabular-nums underline-offset-4 group-hover:underline">
        {displayName(player)}
      </span>
    </Link>
  );
}

export function ProgressBar({
  percent,
  className = "",
}: {
  percent: number;
  className?: string;
}) {
  const value = Math.max(0, Math.min(100, percent));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1 overflow-hidden rounded-full bg-fill ${className}`}
    >
      <div
        className="h-full rounded-full bg-ink"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function AchievementRow({
  name,
  description,
  state = "unlocked",
  dimmed = false,
  percent,
  href,
  meta,
  aside,
}: {
  name: string;
  description: string;
  state?: TrophyState;
  dimmed?: boolean;
  percent?: number;
  href?: string;
  meta?: ReactNode;
  aside?: ReactNode;
}) {
  const className = "relative block overflow-hidden rounded-md bg-row";
  const body = (
    <>
      {percent !== undefined && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 bg-fill"
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      )}
      <span className="relative flex flex-wrap items-center justify-end gap-x-4 gap-y-1 px-4 py-3">
        <Trophy state={state} />
        <span className="min-w-28 flex-1">
          <span className={`block font-medium ${dimmed ? "text-body" : "text-ink"}`}>
            {name}
          </span>
          <span className="block text-sm text-muted">{description}</span>
          {meta && <span className="mt-0.5 block text-xs text-muted">{meta}</span>}
        </span>
        {aside}
      </span>
    </>
  );

  return href ? (
    <Link href={href} className={`${className} hover:bg-row-hover`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
