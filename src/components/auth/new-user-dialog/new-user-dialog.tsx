"use client";

import { ComponentProps } from "react";

import { useTranslations } from "next-intl";

import { UserDTO } from "@/app/db/user";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

import { NewUserForm } from "./new-user-form";

interface SignInDialogProps extends ComponentProps<typeof Dialog> {
   user: UserDTO | null;
}

export function NewUserDialog({ user, ...props }: Readonly<SignInDialogProps>) {
   const t = useTranslations();

   if (!user) return null;

   if (user.isRegistered) {
      return null;
   }

   return (
      <Dialog {...props} open={!user.isRegistered}>
         <DialogContent hideCloseButton onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
               <DialogTitle className="text-2xl">
                  {t("new-user.Welcome to Polttopuutori")}
               </DialogTitle>
            </DialogHeader>
            <DialogDescription className="sr-only">
               {t("new-user.Please select what you intend to use the platform for")}
            </DialogDescription>
            <NewUserForm userId={user.id} />
         </DialogContent>
      </Dialog>
   );
}
