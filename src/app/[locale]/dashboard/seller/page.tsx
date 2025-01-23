import { SellerDashboard } from "../(components)/seller-dashboard";
import { SidebarNav } from "../(components)/sidebar-nav";
import { getSidebarNavItems } from "./layout";

export default async function SellerRootPage() {
   const sidebarNavItems = await getSidebarNavItems();

   sidebarNavItems[0].href = "/dashboard/seller/dashboard";

   return (
      <div className="w-full">
         <SidebarNav items={sidebarNavItems} className="w-full md:hidden" />
         <SellerDashboard className="hidden md:block" />
      </div>
   );
}
