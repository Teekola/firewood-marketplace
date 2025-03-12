import { getTranslations } from "next-intl/server";

import { SidebarNavProps } from "../(components)/sidebar-nav";

export async function getSidebarNavItems() {
   const t = await getTranslations("dashboard");

   const sidebarNavItems: SidebarNavProps["items"] = [
      {
         title: t("Overview"),
         href: ["/dashboard/buyer", "/dashboard/buyer/dashboard"],
      },
      {
         title: t("Quotation Requests"),
         href: "/dashboard/buyer/quotation-requests",
      },
   ];
   return sidebarNavItems;
}
