"use client";

import { DialogTitle } from "@radix-ui/react-dialog";

import { QuotationRequest } from "@/app/db/quotation-request";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { useRouter } from "@/i18n/routing";

import { QuotationRequestTitle } from "./quotation-request-title";

export default function QuotationRequestDialog({
   isOpen,
   quotationRequest,
}: Readonly<{
   isOpen: boolean;
   quotationRequest: QuotationRequest | null;
}>) {
   const router = useRouter();

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
               <DialogTitle className="font-bold">
                  <QuotationRequestTitle quotationRequest={quotationRequest} />
               </DialogTitle>
               <DialogDescription>{"Quotation Request Details"}</DialogDescription>
            </DialogHeader>
         </DialogContent>
      </Dialog>
   );
}
