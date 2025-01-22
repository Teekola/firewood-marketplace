import { getTranslations, setRequestLocale } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Locale, Pathname, routing } from "@/i18n/routing";

import { SidebarNav } from "../(components)/sidebar-nav";

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
   const { locale } = await params;
   setRequestLocale(locale);

   const t = await getTranslations("dashboard");

   const sidebarNavItems: { title: string; href: Pathname }[] = [
      {
         title: t("Seller Dashboard"),
         href: "/dashboard/seller",
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
      },
   ];

   return (
      <>
         <Breadcrumbs className="mb-4" />
         <header className="mb-4 border-b pb-4">
            <h2 className="text-2xl font-bold leading-tight">{t("Seller Dashboard")}</h2>
         </header>
         <div className="flex gap-12">
            <aside className="-mx-4 hidden w-64 md:block">
               <SidebarNav items={sidebarNavItems} />
            </aside>
            <div>{children}</div>
         </div>
      </>
   );
}
