"use client";

import { useFormatter } from "next-intl";

interface DateProps {
   date: Date;
}
export function Date({ date }: DateProps) {
   const format = useFormatter();

   const dateString = format.dateTime(date, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
   });
   return <>{dateString}</>;
}
