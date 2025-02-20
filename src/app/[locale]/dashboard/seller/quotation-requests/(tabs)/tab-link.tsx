"use client";

import { Link, Pathname, StaticPathname, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function TabLink({ href, label }: Readonly<{ href: Pathname; label: string }>) {
   const pathname = usePathname();

   const isWithinRoute = pathname.startsWith(href);
   return (
      <Link
         href={href as StaticPathname}
         className={cn(
            "w-full rounded px-2 py-2 text-center text-sm font-semibold text-muted-foreground transition",
            isWithinRoute && "bg-card text-card-foreground shadow"
         )}
      >
         {label}
      </Link>
   );
}
