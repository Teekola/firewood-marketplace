import { getTranslations } from "next-intl/server";

import { SellerDashboard } from "../(components)/seller-dashboard";
import { SidebarNav } from "../(components)/sidebar-nav";
import { getSidebarNavItems } from "./layout";

export default async function SellerRootPage() {
   const sidebarNavItems = await getSidebarNavItems();
   const t = await getTranslations("dashboard");

   sidebarNavItems[0].href = "/dashboard/seller/dashboard";

   return (
      <div className="w-full">
         <header className="mb-4 border-b pb-4 md:hidden">
            <h2 className="text-2xl font-bold leading-tight">{t("Seller Dashboard")}</h2>
         </header>
         <SidebarNav items={sidebarNavItems} className="w-full md:hidden" />
         <SellerDashboard className="hidden md:block" />
      </div>
   );
}
