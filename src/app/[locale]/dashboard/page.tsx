import { ComponentProps, PropsWithChildren } from "react";

import { getTranslations } from "next-intl/server";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Link, Pathname, StaticPathname } from "@/i18n/routing";
import { authWithSeller } from "@/lib/auth/auth";

import { BecomeSellerDialog } from "./_components/become-seller-dialog";
import { QuotationRequestSidebarNavIndicator } from "./buyer/_components/quotation-request-sidebar-nav-indicator.tsx";

export default async function DashboardPage() {
   const [session, t] = await Promise.all([authWithSeller(), getTranslations()]);

   const isSeller = !!session?.seller;

   return (
      <>
         <div className="mb-4 flex justify-end gap-2">
            {!isSeller && <BecomeSellerDialog />}
            <SignOutButton variant="outline" />
         </div>
         <div className="flex w-full flex-col gap-2 md:grid md:grid-cols-3 lg:grid-cols-5">
            {isSeller && (
               <DashboardLink href="/dashboard/seller">
                  {t("dashboard.Seller Dashboard")}
               </DashboardLink>
            )}

            <DashboardLink href="/dashboard/buyer">
               {t("dashboard.Buyer Dashboard")}
               <QuotationRequestSidebarNavIndicator className="static ml-2" />
            </DashboardLink>
            <DashboardLink href="/dashboard">{t("dashboard.User Settings")}</DashboardLink>
         </div>
      </>
   );
}

interface DashboardLinkProps extends ComponentProps<typeof Button> {
   href: Pathname;
}
function DashboardLink({ href, children }: Readonly<PropsWithChildren<DashboardLinkProps>>) {
   return (
      <Button asChild variant="outline" className="h-16 w-full md:h-32">
         <Link href={href as StaticPathname}>{children}</Link>
      </Button>
   );
}
