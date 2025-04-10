import { getTranslations } from "next-intl/server";

import { TabLink } from "@/app/[locale]/dashboard/seller/quotation-requests/(tabs)/tab-link";

import { AcceptedOffersIndicator } from "../../_components/accepted-offers-indicator";
import { ActiveOffersIndicator } from "../../_components/active-offers-indicator";

export default async function SellerOffersLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const t = await getTranslations();

   return (
      <div className="flex w-full flex-1 flex-col gap-2 pb-5">
         <h1 className="h1 md:h3">{t("dashboard.Sent Offers")}</h1>
         <div className="flex max-w-lg justify-between rounded-md bg-muted p-1">
            <TabLink
               href="/dashboard/seller/offers"
               label={
                  <div className="flex items-center justify-center gap-2">
                     {t("dashboard.Active")} <ActiveOffersIndicator />
                  </div>
               }
            />
            <TabLink
               href="/dashboard/seller/offers/accepted"
               label={
                  <div className="flex items-center justify-center gap-2">
                     {t("dashboard.Accepted")} <AcceptedOffersIndicator />
                  </div>
               }
            />
            <TabLink href="/dashboard/seller/offers/lost" label={t("dashboard.Lost")} />
         </div>

         {children}
      </div>
   );
}
