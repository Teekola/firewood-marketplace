"use client";

import { ComponentProps, useState } from "react";

import { useTranslations } from "next-intl";

import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";

import { GoogleRegisterButton } from "./google-register-button";
import { GoogleSignInButton } from "./google-sign-in-button";

type DialogType = "sign-in" | "register";

interface SignInDialogProps extends ComponentProps<typeof Dialog> {
   signInTitle?: string;
   registerTitle?: string;
   trigger?: React.ReactNode;
}

const defaultTitles = {
   SIGN_IN: "Sign in",
   REGISTER: "Register",
};

export function SignInDialog({
   trigger,
   signInTitle = defaultTitles.SIGN_IN,
   registerTitle = defaultTitles.REGISTER,
   ...props
}: Readonly<SignInDialogProps>) {
   const [dialogType, setDialogType] = useState<DialogType>("sign-in");
   const t = useTranslations("auth");

   function toggleDialogType() {
      setDialogType((prev) => (prev === "sign-in" ? "register" : "sign-in"));
   }

   function SignInContent() {
      return (
         <>
            <DialogHeader>
               <DialogTitle>{signInTitle}</DialogTitle>
            </DialogHeader>
            <GoogleSignInButton />
            <DialogFooter>
               <p className="text-sm">
                  {t("New user")}
                  {"? "}
                  <span className="cursor-pointer underline" onClick={toggleDialogType}>
                     {t("Register here")}
                  </span>
               </p>
            </DialogFooter>
         </>
      );
   }

   function RegisterContent() {
      return (
         <>
            <DialogHeader>
               <DialogTitle>{registerTitle}</DialogTitle>
            </DialogHeader>
            <GoogleRegisterButton />
            <DialogFooter>
               <p className="text-sm">
                  {t("Already have an account")}
                  {"? "}
                  <span className="cursor-pointer underline" onClick={toggleDialogType}>
                     {t("Sign In")}
                  </span>
               </p>
            </DialogFooter>
         </>
      );
   }

   return (
      <Dialog {...props}>
         {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

         <DialogContent className="min-h-48">
            {dialogType === "sign-in" && <SignInContent />}
            {dialogType === "register" && <RegisterContent />}
         </DialogContent>
      </Dialog>
   );
}
