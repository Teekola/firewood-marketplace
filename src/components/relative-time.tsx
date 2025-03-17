"use client";

import { useFormatter, useNow } from "next-intl";

interface RelativeTimeProps {
   date: Date;
   updateIntervalMs?: number;
}
export function RelativeTime({ date, updateIntervalMs = 1000 * 10 }: RelativeTimeProps) {
   const now = useNow({
      updateInterval: updateIntervalMs,
   });
   const format = useFormatter();

   if (now.getTime() - date.getTime() < 60000) {
      return <>{format.relativeTime(date, { now, unit: "minutes" })}</>;
   }
   const timeString = format.relativeTime(date, { now });
   return <>{timeString}</>;
}
