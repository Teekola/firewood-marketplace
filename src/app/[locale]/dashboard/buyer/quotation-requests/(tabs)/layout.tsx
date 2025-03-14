import { getTranslations } from "next-intl/server";

import { TabLink } from "@/app/[locale]/dashboard/seller/quotation-requests/(tabs)/tab-link";

export default async function BuyerQuotationRequestsLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const t = await getTranslations();

   return (
      <div className="flex w-full flex-col gap-2">
         <h1 className="h1 md:h3">{t("buyer.Quotation Requests")}</h1>
         <div className="flex max-w-lg justify-between rounded-md bg-muted p-1">
            <TabLink href="/dashboard/buyer/quotation-requests" label={t("buyer.Active")} />
            <TabLink
               href="/dashboard/buyer/quotation-requests/fulfilled"
               label={t("buyer.Fulfilled")}
            />
         </div>

         {children}
      </div>
   );
}
