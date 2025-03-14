"use client";

import { ComponentProps } from "react";

import { useParams } from "next/navigation";

import { ArrowLeftIcon } from "lucide-react";

import { DynamicPathname, Link, Pathname, StaticPathname, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

type Href =
   | StaticPathname
   | { pathname: DynamicPathname; params: { id: string; offerId: string } }
   | { pathname: DynamicPathname; params: { id: string; offerId: string } };

interface BackButtonLinkProps extends ComponentProps<typeof Button> {
   href?: Href;
   label: string;
}

function getPreviousPath(
   pathname: Pathname,
   params: Record<string, string | string[] | undefined>
): Href {
   const splittedPath = pathname.split("/");
   const indexOfDynamicId = splittedPath.indexOf("[id]");
   const indexOfDynamicOfferId = splittedPath.indexOf("[offerId]");
   const isDynamicIdInRoute = indexOfDynamicId !== -1;

   // Ensure that back button will not direct to route ending in /id and
   // that if a dynamic param is within the route, it is included in the params
   if (isDynamicIdInRoute) {
      const id = params.id as string;
      const isDynamicIdLast = indexOfDynamicId === splittedPath.length - 1;
      const isDynamicOfferIdInRoute = indexOfDynamicOfferId !== -1;
      if (!isDynamicOfferIdInRoute) {
         const endIndex = isDynamicIdLast ? -2 : -1;
         const pathname = splittedPath.slice(0, endIndex).join("/") as DynamicPathname;
         return { pathname, params: { id, offerId: "" } };
      }

      const isDynamicOfferIdLast = indexOfDynamicOfferId === splittedPath.length - 1;
      const endIndex = isDynamicOfferIdLast ? -2 : -1;
      const pathname = splittedPath.slice(0, endIndex).join("/") as DynamicPathname;
      const offerId = params.offerId as string;

      return { pathname, params: { id, offerId } };
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
         variant="outline"
         asChild
         type="button"
         className={cn("group inline-flex items-center justify-between gap-2", props.className)}
      >
         <Link href={finalHref} scroll={false}>
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {label}
         </Link>
      </Button>
   );
}
