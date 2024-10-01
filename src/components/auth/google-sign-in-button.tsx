"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "@/ui/button";

import { GoogleLogo } from "./google-logo";

export function GoogleSignInButton() {
   const t = useTranslations("auth");
   return (
      <Button variant="outline" size="lg" onClick={() => signIn("google")}>
         <GoogleLogo className="mr-2" />
         {t("Sign in with Google")}
      </Button>
   );
}
