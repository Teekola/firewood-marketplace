"use client";

import { ComponentProps } from "react";

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
import { useRouter } from "@/i18n/routing";

import { useClearRequestOffersStore } from "../../../_store/request-offers-store-provider";

export function AbandonRequestDialog({ ...props }: ComponentProps<typeof AlertDialogTrigger>) {
   const t = useTranslations();
   const clearStore = useClearRequestOffersStore();
   const router = useRouter();

   function handleAbort() {
      router.push("/");
      clearStore();
   }

   return (
      <AlertDialog>
         <AlertDialogTrigger {...props} asChild>
            <Button variant="ghost" className="text-foreground-muted">
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
                     <Button type="button" className="bg-destructive" onClick={handleAbort}>
                        {t("actions.Abandon")}
                     </Button>
                  </AlertDialogAction>
               </Button>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
