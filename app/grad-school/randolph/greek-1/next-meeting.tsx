"use client";

import { useSyncExternalStore } from "react";

type Schedule = {
  weekday: string;
  timeZone: string;
  firstMeeting: string;
  lastMeeting: string;
};

const DAY_MS = 86_400_000;

/** Today's date (YYYY-MM-DD) in the meeting's time zone. */
function todayIn(timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
}

/**
 * The next weekly meeting on or after today, or null once the series is over.
 * Meetings repeat every 7 days from firstMeeting through lastMeeting.
 */
export function nextMeeting(s: Schedule, today: string): string | null {
  const first = Date.parse(`${s.firstMeeting}T00:00:00Z`);
  const last = Date.parse(`${s.lastMeeting}T00:00:00Z`);
  const now = Date.parse(`${today}T00:00:00Z`);
  const weeks = now <= first ? 0 : Math.ceil((now - first) / (7 * DAY_MS));
  const next = first + weeks * 7 * DAY_MS;
  return next > last ? null : new Date(next).toISOString().slice(0, 10);
}

function format(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const subscribe = () => () => {};

/**
 * Rendered in the browser so the date stays current between deploys (the
 * page itself is static). The server/first paint shows the weekly cadence.
 */
export function NextMeeting({ schedule }: { schedule: Schedule }) {
  const label = useSyncExternalStore(
    subscribe,
    () => {
      const next = nextMeeting(schedule, todayIn(schedule.timeZone));
      return next ? format(next) : "none scheduled";
    },
    () => `${schedule.weekday}s`,
  );
  return <strong>{label}</strong>;
}
