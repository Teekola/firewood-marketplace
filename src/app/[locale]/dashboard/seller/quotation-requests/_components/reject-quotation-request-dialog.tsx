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
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { useRouter } from "@/i18n/routing";

import { rejectQuotationRequest } from "../actions";

interface RejectQuotationRequestDialogProps extends ComponentProps<typeof AlertDialogTrigger> {
   quotationRequestId: string;
}

export function RejectQuotationRequestDialog({
   quotationRequestId,
   ...props
}: RejectQuotationRequestDialogProps) {
   const t = useTranslations();
   const [isLoading, setIsLoading] = useState(false);

   const router = useRouter();

   async function handleReject(e: React.MouseEvent<HTMLButtonElement>) {
      e.preventDefault();
      setIsLoading(true);
      await rejectQuotationRequest(quotationRequestId);
      // TODO: Display a toast informing that the request was rejected
      router.push("/dashboard/seller/quotation-requests");
   }

   return (
      <AlertDialog>
         <AlertDialogTrigger {...props} asChild>
            <Button size="lg" variant="outline" className="text-foreground-muted">
               {t("actions.Reject")}
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>
                  {t("quotation-request.Reject Quotation Request")}
               </AlertDialogTitle>
               <AlertDialogDescription>
                  {t("quotation-request.reject-request-description")}
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
