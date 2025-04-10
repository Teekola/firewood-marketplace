import { getTranslations, setRequestLocale } from "next-intl/server";

import { BackButtonLink } from "@/components/ui/back-button-link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Locale, routing } from "@/i18n/routing";

import { SidebarNav } from "../_components/sidebar-nav";
import { getSidebarNavItems } from "./get-sidebar-nav-items";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export default async function BuyerDashboardLayout({
   children,
   params,
}: Readonly<{
   children: React.ReactNode;
   params: Promise<{ locale: Locale }>;
}>) {
   const { locale } = await params;
   setRequestLocale(locale);

   const t = await getTranslations("dashboard");

   const sidebarNavItems = await getSidebarNavItems();

   return (
      <>
         <Breadcrumbs className="mb-4" />
         <BackButtonLink label={t("actions.Back")} className="mb-4" />
         <header className="mb-4 hidden border-b pb-4 md:block">
            <p className="text-2xl font-bold leading-tight">{t("Buyer Dashboard")}</p>
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
