import { getTranslations } from "next-intl/server";

import { SidebarNavProps } from "../_components/sidebar-nav";
import { QuotationRequestSidebarNavIndicator } from "./_components/quotation-request-sidebar-nav-indicator.tsx";

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
         indicator: <QuotationRequestSidebarNavIndicator />,
      },
   ];
   return sidebarNavItems;
}
