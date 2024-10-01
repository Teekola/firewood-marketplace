import { getTranslations } from "next-intl/server";

import { auth } from "@/auth/auth";
import { Link } from "@/i18n/routing";
import { Button } from "@/ui/button";

import { SignOutButton } from "./sign-out-button";

export async function AuthButton() {
   const t = await getTranslations();
   const session = await auth();

   const isSignedIn = !!session;

   if (isSignedIn) {
      return <SignOutButton />;
   }

   return <Button asChild>{<Link href="/auth/sign-in">{t("auth.Sign In")}</Link>}</Button>;
}
