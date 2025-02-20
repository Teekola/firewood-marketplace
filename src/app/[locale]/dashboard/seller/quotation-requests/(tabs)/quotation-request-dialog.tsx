"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { useRouter } from "@/i18n/routing";

import QuotationRequestDetails from "../(components)/quotation-request-details";

export default function QuotationRequestDialog({
   isOpen,
   quotationRequest,
}: Readonly<{
   isOpen: boolean;
   quotationRequest: QuotationRequest | null;
}>) {
   const router = useRouter();
   const t = useTranslations("dashboard");

   function handleClose() {
      if (window.history.length > 1) {
         router.back();
         return;
      }
      router.push("/dashboard/seller/quotation-requests");
   }

   if (!quotationRequest) return null;
   return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="text-2xl font-bold">
                  {t("Quotation request details")}
               </DialogTitle>
               <DialogDescription className="sr-only">
                  {t("Quotation request details")}
               </DialogDescription>
            </DialogHeader>
            <QuotationRequestDetails quotationRequest={quotationRequest} />
         </DialogContent>
      </Dialog>
   );
}
