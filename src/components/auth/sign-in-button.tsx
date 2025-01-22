import { ComponentProps } from "react";

import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { Button } from "@/ui/button";

export async function SignInButton({ ...props }: Readonly<ComponentProps<typeof Button>>) {
   const t = await getTranslations();

   return (
      <Button {...props} asChild>
         {<Link href="/auth/sign-in">{t("auth.Sign In")}</Link>}
      </Button>
   );
}
