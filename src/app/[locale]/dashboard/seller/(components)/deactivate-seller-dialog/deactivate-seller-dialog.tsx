"use client";

import { ComponentProps, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
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
import { ButtonLoading } from "@/components/ui/button-loading";
import { useRouter } from "@/i18n/routing";

import {
   sellerQuotationRequestsQueryKey,
   sellerRejectedQuotationRequestsQueryKey,
   sellerUnseenQuotationRequestsQueryKey,
} from "../../quotation-requests/constants";
import { deactivateSeller } from "./actions";

type DeactivateSellerDialogProps = ComponentProps<typeof AlertDialogTrigger>;

export function DeactivateSellerDialog({ ...props }: DeactivateSellerDialogProps) {
   const t = useTranslations();
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();
   const queryClient = useQueryClient();

   async function handleDeactivateSeller() {
      setIsLoading(true);
      await deactivateSeller();

      queryClient.invalidateQueries({ queryKey: sellerQuotationRequestsQueryKey });
      queryClient.invalidateQueries({ queryKey: sellerRejectedQuotationRequestsQueryKey });
      queryClient.invalidateQueries({ queryKey: sellerUnseenQuotationRequestsQueryKey });

      // TODO: Add toast
      router.refresh();
   }

   return (
      <AlertDialog>
         <AlertDialogTrigger {...props} asChild>
            <Button>{t("actions.Stop receiving requests")}</Button>
         </AlertDialogTrigger>

         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{t("deactivate-seller.Stop receiving requests")}</AlertDialogTitle>
               <AlertDialogDescription>
                  {t("deactivate-seller.stop-receiving-requests-description")}
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="w-full justify-self-end sm:w-72">
               <AlertDialogCancel asChild>
                  <Button type="button" variant="outline" className="w-full">
                     {t("actions.Cancel")}
                  </Button>
               </AlertDialogCancel>

               {!isLoading && (
                  <Button asChild className="w-full" variant="destructive">
                     <AlertDialogAction onClick={handleDeactivateSeller}>
                        {t("actions.Stop receiving requests")}
                     </AlertDialogAction>
                  </Button>
               )}
               {isLoading && <ButtonLoading className="w-full" variant="destructive" />}
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
