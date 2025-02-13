"use client";

import { DialogTitle } from "@radix-ui/react-dialog";

import { QuotationRequest } from "@/app/db/quotation-request";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";

import { QuotationRequestTitle } from "./quotation-request-title";

export default function QuotationRequestDialog({
   isOpen,
   handleDialogClose,
   quotationRequest,
}: Readonly<{
   isOpen: boolean;
   quotationRequest: QuotationRequest | null;
   handleDialogClose: () => void;
}>) {
   if (!quotationRequest) return null;
   return (
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
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
