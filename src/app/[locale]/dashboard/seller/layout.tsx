import { getTranslations, setRequestLocale } from "next-intl/server";

import { BackButtonLink } from "@/components/back-button-link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Locale, routing } from "@/i18n/routing";

import { QuotationRequestSidebarNavIndicator } from "../(components)/quotation-request-sidebar-nav-indicator";
import { SentOffersSidebarNavIndicator } from "../(components)/sent-offers-sidebar-nav-indicator";
import { SidebarNav, SidebarNavProps } from "../(components)/sidebar-nav";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export async function getSidebarNavItems() {
   const t = await getTranslations("dashboard");

   const sidebarNavItems: SidebarNavProps["items"] = [
      {
         title: t("Overview"),
         href: ["/dashboard/seller", "/dashboard/seller/dashboard"],
      },
      {
         title: t("Profile"),
         href: "/dashboard/seller/profile",
      },
      {
         title: t("Location"),
         href: "/dashboard/seller/location",
      },
      {
         title: t("Quotation Requests"),
         href: "/dashboard/seller/quotation-requests",
         indicator: <QuotationRequestSidebarNavIndicator />,
      },
      {
         title: t("Sent Offers"),
         href: "/dashboard/seller/offers",
         indicator: <SentOffersSidebarNavIndicator />,
      },
   ];
   return sidebarNavItems;
}

export default async function SellerDashboardLayout({
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
            <h2 className="text-2xl font-bold leading-tight">{t("Seller Dashboard")}</h2>
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
