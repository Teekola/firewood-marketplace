"use client";

import { useEffect, useState } from "react";

import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { usePathname, useRouter } from "@/i18n/routing";

import QuotationRequestDetails from "../(components)/quotation-request-details";

const DIALOG_PREVIOUS_ROUTE = "/dashboard/seller/quotation-requests";
const DIALOG_ROUTE = "/dashboard/seller/quotation-requests/id/[id]";

export default function QuotationRequestDialog({
   isOpen,
   quotationRequest,
}: Readonly<{
   isOpen: boolean;
   quotationRequest: QuotationRequest | null;
}>) {
   const router = useRouter();
   const t = useTranslations("dashboard");
   const [open, setOpen] = useState(isOpen);
   const pathname = usePathname();

   function handleClose() {
      router.push(DIALOG_PREVIOUS_ROUTE);
   }

   useEffect(() => {
      if (pathname === DIALOG_ROUTE) setOpen(true);
      if (pathname !== DIALOG_ROUTE) setOpen(false);
   }, [pathname]);

   if (!quotationRequest) return null;
   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="text-left text-2xl font-bold">
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
