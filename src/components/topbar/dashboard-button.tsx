import { ComponentProps } from "react";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { Button } from "@/ui/button";

export function DashboardButton({ ...props }: Readonly<ComponentProps<typeof Button>>) {
   const t = useTranslations("dashboard");

   return (
      <Button {...props} asChild>
         <Link href="/dashboard">{t("Dashboard")}</Link>
      </Button>
   );
}
