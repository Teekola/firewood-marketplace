"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "@/ui/button";

import { GoogleLogo } from "./google-logo";

export function GoogleRegisterButton() {
   const t = useTranslations("auth");
   return (
      <Button
         variant="outline"
         className="bg-[#fff] font-[Roboto] text-[#1f1f1f] hover:bg-[#efefef]"
         size="lg"
         onClick={() => signIn("google")}
      >
         <GoogleLogo className="mr-2" />
         {t("Register with Google")}
      </Button>
   );
}
