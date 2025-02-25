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

import { rejectQuotationRequest } from "../actions";

interface RejectQuotationRequestDialogProps extends ComponentProps<typeof AlertDialogTrigger> {
   quotationRequestId: string;
}

export function RejectQuotationRequestDialog({
   quotationRequestId,
   ...props
}: RejectQuotationRequestDialogProps) {
   const t = useTranslations();

   const router = useRouter();

   async function handleReject() {
      await rejectQuotationRequest(quotationRequestId);
      // TODO: Display a toast informing that the request was rejected
      router.push("/dashboard/seller/quotation-requests");
   }

   return (
      <AlertDialog>
         <AlertDialogTrigger {...props} asChild>
            <Button size="lg" variant="outline" className="text-muted-foreground">
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
            <AlertDialogFooter>
               <AlertDialogCancel asChild>
                  <Button type="button" variant="outline">
                     {t("actions.Cancel")}
                  </Button>
               </AlertDialogCancel>
               <Button asChild variant="destructive">
                  <AlertDialogAction asChild>
                     <Button type="button" className="bg-destructive" onClick={handleReject}>
                        {t("actions.Reject")}
                     </Button>
                  </AlertDialogAction>
               </Button>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
