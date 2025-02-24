"use client";

import { Link, Pathname, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function TabLink({ href, label }: Readonly<{ href: Pathname; label: string }>) {
   const pathname = usePathname();

   return (
      <Link
         href={{ pathname: href, params: { id: "" } }}
         className={cn(
            "w-full rounded px-2 py-2 text-center text-sm font-semibold text-muted-foreground transition",
            pathname === href &&
               "cursor-default bg-card text-card-foreground shadow active:pointer-events-none"
         )}
      >
         {label}
      </Link>
   );
}
