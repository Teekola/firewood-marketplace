"use client";

import { ComponentProps } from "react";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "@/ui/button";

type SignOutButtonProps = ComponentProps<typeof Button>;

export function SignOutButton({ ...props }: SignOutButtonProps) {
   const t = useTranslations("auth");
   return (
      <Button {...props} onClick={() => signOut()}>
         {t("Sign Out")}
      </Button>
   );
}
