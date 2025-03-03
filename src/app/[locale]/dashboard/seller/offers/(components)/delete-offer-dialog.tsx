"use client";

import { ComponentProps, useState } from "react";

import { Trash2Icon } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "@/i18n/routing";

import { deleteOffer } from "../actions";

interface DeleteOfferDialogProps extends ComponentProps<typeof AlertDialogTrigger> {
   offerId: string;
   quotationRequestId: string;
}

export function DeleteOfferDialog({
   offerId,
   quotationRequestId,
   ...props
}: DeleteOfferDialogProps) {
   const t = useTranslations();
   const [isLoading, setIsLoading] = useState(false);

   const router = useRouter();

   async function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
      e.preventDefault();
      setIsLoading(true);
      await deleteOffer({ offerId, quotationRequestId });
      // TODO: Display a toast informing that the offer was deleted
      router.push("/dashboard/seller/offers");
   }

   return (
      <AlertDialog>
         <Tooltip>
            <AlertDialogTrigger {...props} asChild>
               <TooltipTrigger asChild>
                  <Button variant="outline" size="lg" className="px-3">
                     <Trash2Icon className="h-4 w-4" />
                  </Button>
               </TooltipTrigger>
            </AlertDialogTrigger>
            <TooltipContent>
               <p>{t("offer.Delete Offer")}</p>
            </TooltipContent>
         </Tooltip>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{t("offer.Delete Offer")}</AlertDialogTitle>
               <AlertDialogDescription>
                  {t("offer.delete-offer-description")}
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="w-full justify-self-end sm:w-72">
               <AlertDialogCancel asChild>
                  <Button type="button" variant="outline" className="w-full">
                     {t("actions.Cancel")}
                  </Button>
               </AlertDialogCancel>

               {!isLoading && (
                  <Button asChild variant="destructive" className="w-full">
                     <AlertDialogAction onClick={handleDelete}>
                        {t("actions.Delete")}
                     </AlertDialogAction>
                  </Button>
               )}
               {isLoading && <ButtonLoading className="w-full" variant="destructive" />}
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
