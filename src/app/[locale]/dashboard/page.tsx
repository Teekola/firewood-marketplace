import { ComponentProps, PropsWithChildren } from "react";

import { getTranslations } from "next-intl/server";

import { authWithSeller } from "@/auth/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Link, Pathname, StaticPathname } from "@/i18n/routing";

import { BecomeSellerDialog } from "./(components)/become-seller-dialog";
import { QuotationRequestSidebarNavIndicator } from "./buyer/(components)/quotation-request-sidebar-nav-indicator.tsx";

export default async function DashboardPage() {
   const session = await authWithSeller();
   const t = await getTranslations("dashboard");

   const isSeller = !!session?.seller;

   return (
      <>
         <div className="mb-4 flex justify-end gap-2">
            {!isSeller && <BecomeSellerDialog />}
            <SignOutButton variant="outline" />
         </div>
         <div className="flex w-full flex-col gap-2 md:grid md:grid-cols-3 lg:grid-cols-5">
            {isSeller && (
               <DashboardLink href="/dashboard/seller">{t("Seller Dashboard")}</DashboardLink>
            )}

            <DashboardLink href="/dashboard/buyer">
               {t("Buyer Dashboard")}
               <QuotationRequestSidebarNavIndicator className="static ml-2" />
            </DashboardLink>
            <DashboardLink href="/dashboard">{t("User Settings")}</DashboardLink>
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
