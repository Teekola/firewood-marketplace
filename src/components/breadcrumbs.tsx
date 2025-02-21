"use client";

import * as React from "react";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import {
   Breadcrumb,
   BreadcrumbEllipsis,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger,
} from "@/components/ui/drawer";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Link, Pathname, StaticPathname, usePathname } from "@/i18n/routing";

const maxItemsToDisplayByDevice = {
   mobile: 3,
   desktop: 4,
};

function useBreadcrumbs() {
   const pathname = usePathname();
   const params = useParams();

   const staticPathname = pathname.replace(/\/\[[^\]]+\]/g, "");

   const t = useTranslations("breadcrumbs");
   const breadCrumbs: {
      href?: StaticPathname | { pathname: Pathname; params: { id: string } };
      label: string;
   }[] = [];

   const translated = t(staticPathname);
   const parts = translated.split("/").filter(Boolean);
   const hrefParts = pathname.split("/").filter(Boolean);

   // Handle the case where there is "id" in the route, in which case the path needs
   // to include the dynamic id and replace that id with the route of the item
   if (hrefParts.includes("id")) {
      hrefParts.splice(hrefParts.indexOf("id"), 2, "id/[id]");

      parts.forEach((part, i) => {
         const path = ("/" + hrefParts.slice(0, i + 1).join("/")) as Pathname;
         breadCrumbs.push({
            ...(path !== pathname && {
               href: { pathname: path, params: { id: params.id as string } },
            }),
            label: part,
         });
      });
      return breadCrumbs;
   }

   parts.forEach((part, i) => {
      const href = ("/" + hrefParts.slice(0, i + 1).join("/")) as StaticPathname;
      breadCrumbs.push({ ...(href !== pathname && { href }), label: part });
   });

   return breadCrumbs;
}

type BreadcrumbsProps = React.ComponentProps<typeof Breadcrumb>;
export function Breadcrumbs({ ...props }: BreadcrumbsProps) {
   const [open, setOpen] = React.useState(false);
   const isDesktop = useMediaQuery("(min-width: 768px)");
   const t = useTranslations("actions");
   const breadCrumbs = useBreadcrumbs();

   const maxItemsToDisplay = isDesktop
      ? maxItemsToDisplayByDevice.desktop
      : maxItemsToDisplayByDevice.mobile;

   const endingBreadcrumbs = breadCrumbs.slice(
      breadCrumbs.length > maxItemsToDisplay ? -maxItemsToDisplay + 1 : 1
   );

   return (
      <Breadcrumb {...props}>
         <BreadcrumbList>
            <BreadcrumbItem>
               <BreadcrumbLink asChild>
                  <Link href={breadCrumbs[0].href!}> {breadCrumbs[0].label}</Link>
               </BreadcrumbLink>
            </BreadcrumbItem>
            {breadCrumbs.length > 1 && <BreadcrumbSeparator />}
            {breadCrumbs.length > maxItemsToDisplay ? (
               <>
                  <BreadcrumbItem>
                     {isDesktop && (
                        <DropdownMenu open={open} onOpenChange={setOpen}>
                           <DropdownMenuTrigger
                              className="flex items-center gap-1"
                              aria-label="Toggle menu"
                           >
                              <BreadcrumbEllipsis className="h-4 w-4" />
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="start">
                              {breadCrumbs.slice(1, -3).map((item, index) => (
                                 <DropdownMenuItem key={index}>
                                    <BreadcrumbLink asChild>
                                       <Link href={item.href!}>{item.label}</Link>
                                    </BreadcrumbLink>
                                 </DropdownMenuItem>
                              ))}
                           </DropdownMenuContent>
                        </DropdownMenu>
                     )}
                     {!isDesktop && (
                        <Drawer open={open} onOpenChange={setOpen}>
                           <DrawerTrigger aria-label="Toggle Menu">
                              <BreadcrumbEllipsis className="h-4 w-4" />
                           </DrawerTrigger>
                           <DrawerContent>
                              <DrawerHeader className="text-left">
                                 <DrawerTitle>{t("Navigate to")}</DrawerTitle>
                                 <DrawerDescription>
                                    {t("Select a page to navigate to")}
                                 </DrawerDescription>
                              </DrawerHeader>
                              <div className="grid gap-1 px-4">
                                 {breadCrumbs.slice(1, -2).map((item, index) => (
                                    <BreadcrumbLink asChild key={index} className="py-1 text-sm">
                                       <Link href={item.href!}>{item.label}</Link>
                                    </BreadcrumbLink>
                                 ))}
                              </div>
                              <DrawerFooter className="pt-4">
                                 <DrawerClose asChild>
                                    <Button variant="outline">{t("Close")}</Button>
                                 </DrawerClose>
                              </DrawerFooter>
                           </DrawerContent>
                        </Drawer>
                     )}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
               </>
            ) : null}
            {endingBreadcrumbs.map((item, index) => (
               <BreadcrumbItem key={index}>
                  {item.href ? (
                     <>
                        <BreadcrumbLink asChild className="max-w-32 truncate md:max-w-none">
                           <Link href={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                        <BreadcrumbSeparator />
                     </>
                  ) : (
                     <BreadcrumbPage className="max-w-32 truncate md:max-w-none">
                        {item.label}
                     </BreadcrumbPage>
                  )}
               </BreadcrumbItem>
            ))}
         </BreadcrumbList>
      </Breadcrumb>
   );
}
