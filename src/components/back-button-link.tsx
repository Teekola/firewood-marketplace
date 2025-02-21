"use client";

import { ComponentProps } from "react";

import { useParams } from "next/navigation";

import { ArrowLeftIcon } from "lucide-react";

import { Link, Pathname, StaticPathname, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

interface BackButtonLinkProps extends ComponentProps<typeof Button> {
   href?: StaticPathname | { pathname: Pathname; params: { id: string } };
   label: string;
}

function getPreviousPath(
   pathname: Pathname,
   params: Record<string, string | string[] | undefined>
): { pathname: Pathname; params: { id: string } } | Pathname {
   const splittedPath = pathname.split("/");
   const isDynamicIdInRoute = splittedPath.find((item) => item === "[id]");

   // Ensure that back button will not direct to route ending in /id and
   // that if the dynamic param is within the route, it is included in the params
   if (isDynamicIdInRoute) {
      const id = (params.id ?? "") as string;
      const isLast = splittedPath.indexOf("[id]") === splittedPath.length - 1;
      const endIndex = isLast ? -2 : -1;
      const pathname = splittedPath.slice(0, endIndex).join("/") as Pathname;
      return { pathname, params: { id } };
   }
   return splittedPath.slice(0, -1).join("/") as StaticPathname;
}

export function BackButtonLink({ label, href, ...props }: Readonly<BackButtonLinkProps>) {
   const pathname = usePathname();
   const params = useParams();

   const finalHref = href ? href : getPreviousPath(pathname, params);
   return (
      <Button
         {...props}
         asChild
         variant="outline"
         type="button"
         className={cn("group inline-flex items-center justify-between gap-2", props.className)}
      >
         <Link href={finalHref as StaticPathname} scroll={false}>
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {label}
         </Link>
      </Button>
   );
}
