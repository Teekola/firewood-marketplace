"use client";

import { useFormatter, useNow } from "next-intl";

interface RelativeTimeProps {
   date: Date;
   updateIntervalMs?: number;
}
export function RelativeTime({ date, updateIntervalMs = 1000 * 10 }: RelativeTimeProps) {
   let now = useNow({
      updateInterval: updateIntervalMs,
   });
   const format = useFormatter();
   if (now < date) now = date;
   const timeString = format.relativeTime(date, { now });
   return <>{timeString}</>;
}
