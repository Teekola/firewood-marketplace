"use client";

import { useTranslations } from "next-intl";

import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Button } from "@/ui/button";

export function DashboardButton() {
   const t = useTranslations("dashboard");
   const pathname = usePathname();

   const isDashboard = pathname === "/dashboard";
   if (isDashboard) {
      return <p className="h-9 px-4 py-2 text-sm font-medium">{t("Dashboard")}</p>;
   }
   return (
      <Button asChild>
         <Link href="/dashboard">{t("Dashboard")}</Link>
      </Button>
   );
}
