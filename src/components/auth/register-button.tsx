import { ComponentProps } from "react";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { Button } from "@/ui/button";

export function RegisterButton({ ...props }: Readonly<ComponentProps<typeof Button>>) {
   const t = useTranslations();

   return (
      <Button {...props} asChild>
         {<Link href="/auth/register">{t("auth.Register")}</Link>}
      </Button>
   );
}
