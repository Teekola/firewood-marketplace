"use client";

import { ComponentProps } from "react";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/ui/button";

export function SignInButton({ ...props }: Readonly<ComponentProps<typeof Button>>) {
   const t = useTranslations();
   const pathname = usePathname();

   return (
      <Button {...props} asChild>
         {
            <Link href={{ pathname: "/auth/sign-in", query: { callbackUrl: pathname } }}>
               {t("auth.Sign In")}
            </Link>
         }
      </Button>
   );
}
