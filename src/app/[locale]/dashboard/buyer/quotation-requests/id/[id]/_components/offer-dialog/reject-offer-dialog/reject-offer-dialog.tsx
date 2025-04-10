"use client";

import { ComponentProps, useState } from "react";

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
import { Button, ButtonProps } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { useRouter } from "@/i18n/routing";

import { rejectOffer } from "./actions";

interface RejectOfferDialogProps extends ComponentProps<typeof AlertDialogTrigger> {
   offerId: string;
   quotationRequestId: string;
   variant?: ButtonProps["variant"];
   isAcceptedOffer?: boolean;
}

export function RejectOfferDialog({
   offerId,
   quotationRequestId,
   variant,
   isAcceptedOffer,
   ...props
}: RejectOfferDialogProps) {
   const t = useTranslations();
   const [isLoading, setIsLoading] = useState(false);

   const router = useRouter();

   async function handleReject(e: React.MouseEvent<HTMLButtonElement>) {
      e.preventDefault();
      setIsLoading(true);
      await rejectOffer({ offerId, quotationRequestId, isAcceptedOffer: isAcceptedOffer || false });
      // TODO: Display a toast informing that the request was rejected
      router.push({
         pathname: "/dashboard/buyer/quotation-requests/id/[id]",
         params: { id: quotationRequestId },
      });
   }

   return (
      <AlertDialog>
         <AlertDialogTrigger {...props} asChild>
            <Button size="lg" variant={variant ?? "outline"}>
               {t("actions.Reject Offer")}
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{t("offer.Reject Offer")}</AlertDialogTitle>
               <AlertDialogDescription>
                  {t("offer.reject-offer-description")}
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
                     <AlertDialogAction onClick={handleReject}>
                        {t("actions.Reject")}
                     </AlertDialogAction>
                  </Button>
               )}
               {isLoading && <ButtonLoading className="w-full" variant="destructive" />}
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
