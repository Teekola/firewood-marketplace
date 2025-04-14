"use client";

import { ReactNode } from "react";

import { useParams } from "next/navigation";

import {
   DynamicPathname,
   Link,
   SingleDynamicPathname,
   StaticPathname,
   usePathname,
} from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function TabLink({
   href,
   label,
}: Readonly<{
   href:
      | StaticPathname
      | { pathname: SingleDynamicPathname; params: { id: string } }
      | { pathname: DynamicPathname; params: { id: string; offerId: string } };
   label: ReactNode | string;
}>) {
   const pathname = usePathname();
   const params = useParams();

   const isCurrentPath =
      typeof href === "string"
         ? pathname === href
         : pathname === href.pathname && params.id === href.params.id;

   return (
      <Link
         href={href}
         className={cn(
            "w-full rounded px-2 py-2 text-center text-sm font-semibold text-foreground-muted transition",
            isCurrentPath &&
               "cursor-default bg-card text-card-foreground shadow active:pointer-events-none"
         )}
      >
         {label}
      </Link>
   );
}
