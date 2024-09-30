"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "@/ui/button";

export function SignOutButton() {
   const t = useTranslations("auth");
   return <Button onClick={() => signOut()}>{t("Sign Out")}</Button>;
}
