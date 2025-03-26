import { getTranslations } from "next-intl/server";

import { TabLink } from "@/app/[locale]/dashboard/seller/quotation-requests/(tabs)/tab-link";

export default async function SellerOffersLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const t = await getTranslations();

   return (
      <div className="flex w-full flex-col gap-2">
         <h1 className="h1 md:h3">{t("dashboard.Sent Offers")}</h1>
         <div className="flex max-w-lg justify-between rounded-md bg-muted p-1">
            <TabLink href="/dashboard/seller/offers" label={t("dashboard.Active")} />
            <TabLink href="/dashboard/seller/offers/accepted" label={t("dashboard.Accepted")} />
            <TabLink href="/dashboard/seller/offers/lost" label={t("dashboard.Lost")} />
         </div>

         {children}
      </div>
   );
}
