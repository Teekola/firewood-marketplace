import { ComponentProps } from "react";

import { getTranslations } from "next-intl/server";

import { auth } from "@/auth/auth";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

import { NewUserForm } from "./new-user-form";

type SignInDialogProps = ComponentProps<typeof Dialog>;

export async function NewUserDialog({ ...props }: Readonly<SignInDialogProps>) {
   const session = await auth();
   const t = await getTranslations("new-user");

   if (!session) return null;

   if (session.user.isRegistered) {
      return null;
   }

   return (
      <Dialog {...props} open={!session.user.isRegistered}>
         <DialogContent hideCloseButton className="min-h-48">
            <DialogHeader>
               <DialogTitle className="text-2xl">{t("Welcome to Polttopuutori")}</DialogTitle>
            </DialogHeader>
            <NewUserForm />
            <DialogDescription className="sr-only">
               {t("Please select what you intend to use the platform for")}
            </DialogDescription>
            <DialogFooter></DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
