"use client";

import { useEffect, useState } from "react";

import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { QuotationRequest } from "@/db/quotation-request";
import { usePathname, useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";

import { useUpdateQuotationRequestViewedAt } from "../(hooks)/use-update-quotation-request-viewed-at";
import QuotationRequestDetails from "../../../../../../components/quotation-request/quotation-request-details";
import { RejectQuotationRequestDialog } from "../_components/reject-quotation-request-dialog";

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
   const t = useTranslations();
   const [open, setOpen] = useState(isOpen);
   const pathname = usePathname();

   function handleClose() {
      router.push(DIALOG_PREVIOUS_ROUTE);
   }

   useEffect(() => {
      if (pathname === DIALOG_ROUTE) setOpen(true);
      if (pathname !== DIALOG_ROUTE) setOpen(false);
   }, [pathname]);

   useUpdateQuotationRequestViewedAt({ quotationRequestId: quotationRequest?.id });

   if (!quotationRequest) return null;
   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="text-left text-2xl font-bold">
                  {t("dashboard.Quotation request details")}
               </DialogTitle>
               <DialogDescription className="sr-only">
                  {t("dashboard.Quotation request details")}
               </DialogDescription>
            </DialogHeader>
            <QuotationRequestDetails quotationRequest={quotationRequest} />
            <div className="mt-4 flex max-w-lg flex-col gap-2 sm:flex-row-reverse">
               <Button asChild className="w-full" size="lg">
                  <Link
                     href={{
                        pathname: "/dashboard/seller/quotation-requests/id/[id]/make-offer",
                        params: { id: quotationRequest.id },
                     }}
                  >
                     {t("quotation-request.Make offer")}
                  </Link>
               </Button>
               <RejectQuotationRequestDialog
                  quotationRequestId={quotationRequest.id}
                  className="w-full"
               />
            </div>
         </DialogContent>
      </Dialog>
   );
}
