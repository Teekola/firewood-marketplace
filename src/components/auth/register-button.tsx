import { ComponentProps } from "react";

import { getTranslations } from "next-intl/server";

import { auth } from "@/auth/auth";
import { Link } from "@/i18n/routing";
import { Button } from "@/ui/button";

import { SignOutButton } from "./sign-out-button";

export async function RegisterButton({ ...props }: Readonly<ComponentProps<typeof Button>>) {
   const t = await getTranslations();
   const session = await auth();

   const isSignedIn = !!session;

   if (isSignedIn) {
      return <SignOutButton />;
   }

   return (
      <Button {...props} asChild>
         {<Link href="/auth/register">{t("auth.Register")}</Link>}
      </Button>
   );
}
