import { getTranslations, setRequestLocale } from "next-intl/server";

import { BackButtonLink } from "@/components/ui/back-button-link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Locale } from "@/i18n/routing";

import { SidebarNav } from "../_components/sidebar-nav";
import { getSidebarNavItems } from "./get-sidebar-nav-items";

export default async function BuyerDashboardLayout({
   children,
   params,
}: Readonly<{
   children: React.ReactNode;
   params: Promise<{ locale: Locale }>;
}>) {
   const { locale } = await params;
   setRequestLocale(locale);
   const [t, sidebarNavItems] = await Promise.all([getTranslations(), getSidebarNavItems()]);

   return (
      <>
         <Breadcrumbs className="mb-4" />
         <BackButtonLink label={t("actions.Back")} className="mb-4" />
         <header className="mb-4 hidden border-b pb-4 md:block">
            <p className="text-2xl font-bold leading-tight">{t("dashboard.Buyer Dashboard")}</p>
         </header>
         <div className="flex h-full gap-12">
            <aside className="hidden md:block 2xl:-mx-4">
               <SidebarNav items={sidebarNavItems} />
            </aside>
            {children}
         </div>
      </>
   );
}
