import { getTranslations } from "next-intl/server";

import { SidebarNav } from "../_components/sidebar-nav";
import { SellerDashboard } from "./_components/seller-dashboard";
import { getSidebarNavItems } from "./get-sidebar-nav-items";

export default async function SellerRootPage() {
   const [sidebarNavItems, t] = await Promise.all([getSidebarNavItems(), getTranslations()]);

   sidebarNavItems[0].href = "/dashboard/seller/dashboard";

   return (
      <div className="w-full">
         <header className="mb-4 border-b pb-4 md:hidden">
            <h2 className="text-2xl font-bold leading-tight">{t("dashboard.Seller Dashboard")}</h2>
         </header>
         <SidebarNav items={sidebarNavItems} className="w-full md:hidden" />
         <SellerDashboard className="hidden md:block" />
      </div>
   );
}
