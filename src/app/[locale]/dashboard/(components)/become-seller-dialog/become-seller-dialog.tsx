"use client";

import { useState } from "react";

import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "@/i18n/routing";

import { addSellerToUser } from "./actions";

export function BecomeSellerDialog() {
   const t = useTranslations();
   const [isOpen, setIsOpen] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();

   async function handleBecomeSeller() {
      setIsSubmitting(true);
      await addSellerToUser();
      router.push("/dashboard/seller");
   }

   return (
      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
         <DialogTrigger asChild>
            <Button>{t("dashboard.Become a Seller")}</Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="text-left text-2xl font-bold">
                  {t("dashboard.Become a Seller")}
               </DialogTitle>
               <DialogDescription>{t("dashboard.become-a-seller-description")}</DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex max-w-lg flex-col gap-2 sm:flex-row-reverse">
               {!isSubmitting && (
                  <Button size="lg" onClick={handleBecomeSeller} className="w-full">
                     {t("dashboard.Become a Seller")}
                  </Button>
               )}
               {isSubmitting && <ButtonLoading size="lg" className="w-full" />}
               <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
               >
                  {t("actions.Cancel")}
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}
