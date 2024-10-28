"use client";

import { useTranslations } from "next-intl";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export function AbandonRequestDialog() {
   const t = useTranslations();
   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>
            <Button variant="ghost" className="text-muted-foreground">
               {t("request-offers.Abandon Request")}
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{t("request-offers.Abandon Request")}</AlertDialogTitle>
               <AlertDialogDescription>
                  {t("request-offers.abandon-request-description")}
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel>{t("actions.Cancel")}</AlertDialogCancel>
               <Button asChild variant="destructive">
                  <AlertDialogAction asChild>
                     <Link href="/" className="bg-destructive">
                        {t("actions.Abandon")}
                     </Link>
                  </AlertDialogAction>
               </Button>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
