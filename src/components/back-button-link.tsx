"use client";

import { ComponentProps } from "react";

import { ArrowLeftIcon } from "lucide-react";

import { Link, Pathname, StaticPathname, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

interface BackButtonLinkProps extends ComponentProps<typeof Button> {
   href?: Pathname;
   label: string;
}

function getPreviousPath(pathname: Pathname) {
   const splittedPath = pathname.split("/");
   const lastAcceptablePathIndex =
      splittedPath[splittedPath.length - 1] === "id"
         ? splittedPath.length - 2
         : splittedPath.length - 2;
   return splittedPath.slice(0, lastAcceptablePathIndex).join("/") as Pathname;
}

export function BackButtonLink({ label, href, ...props }: Readonly<BackButtonLinkProps>) {
   const pathname = usePathname();

   const finalHref = href ? href : getPreviousPath(pathname);
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
