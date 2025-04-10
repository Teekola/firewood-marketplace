import { getTranslations, setRequestLocale } from "next-intl/server";

import { BackButtonLink } from "@/components/ui/back-button-link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Locale, routing } from "@/i18n/routing";
import { authWithSeller } from "@/lib/auth/auth";

import { SidebarNav } from "../_components/sidebar-nav";
import { ActivateSellerDialog } from "./_components/activate-seller-dialog";
import { DeactivateSellerDialog } from "./_components/deactivate-seller-dialog";
import { getSidebarNavItems } from "./get-sidebar-nav-items";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export default async function SellerDashboardLayout({
   children,
   params,
}: Readonly<{
   children: React.ReactNode;
   params: Promise<{ locale: Locale }>;
}>) {
   const [{ locale }, t, sidebarNavItems, seller] = await Promise.all([
      params,
      getTranslations(),
      getSidebarNavItems(),
      authWithSeller(),
   ]);
   setRequestLocale(locale);

   if (!seller) return null;

   return (
      <>
         <Breadcrumbs className="mb-4" />
         <BackButtonLink label={t("actions.Back")} className="mb-4" />
         <header className="mb-4 hidden flex-wrap justify-between gap-2 border-b pb-4 md:flex">
            <h2 className="text-2xl font-bold leading-tight">{t("dashboard.Seller Dashboard")}</h2>

            {!seller.seller?.isActive ? <ActivateSellerDialog /> : <DeactivateSellerDialog />}
         </header>
         <div className="flex h-full gap-12">
            <aside className="hidden w-64 md:block 2xl:-mx-4">
               <SidebarNav items={sidebarNavItems} />
            </aside>
            {children}
         </div>
      </>
   );
}
