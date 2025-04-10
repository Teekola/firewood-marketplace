import { getTranslations } from "next-intl/server";

import { SidebarNav } from "../_components/sidebar-nav";
import { BuyerDashboard } from "./_components/buyer-dashboard";
import { getSidebarNavItems } from "./get-sidebar-nav-items";

export default async function BuyerRootPage() {
   const [sidebarNavItems, t] = await Promise.all([
      getSidebarNavItems(),
      getTranslations("dashboard"),
   ]);
   sidebarNavItems[0].href = "/dashboard/buyer/dashboard";
   return (
      <div className="w-full">
         <header className="mb-4 border-b pb-4 md:hidden">
            <h2 className="text-2xl font-bold leading-tight">{t("Buyer Dashboard")}</h2>
         </header>
         <SidebarNav items={sidebarNavItems} className="w-full md:hidden" />
         <BuyerDashboard className="hidden md:block" />
      </div>
   );
}
