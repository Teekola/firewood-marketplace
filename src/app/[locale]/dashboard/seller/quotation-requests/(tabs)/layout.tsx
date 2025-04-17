import { PropsWithChildren } from "react";

import { getTranslations } from "next-intl/server";

import { TabLink } from "./tab-link";

export default async function QuotationRequestsLayout({
   children,
   modal,
}: Readonly<PropsWithChildren<{ modal: React.ReactNode }>>) {
   const t = await getTranslations();
   return (
      <div className="flex h-full w-full flex-col gap-4 pb-5">
         <h1 className="h1 md:h3">{t("dashboard.Quotation Requests")}</h1>
         <div className="flex max-w-lg justify-between rounded-md bg-muted p-1">
            <TabLink href="/dashboard/seller/quotation-requests" label={t("dashboard.Active")} />
            <TabLink
               href="/dashboard/seller/quotation-requests/rejected"
               label={t("dashboard.Rejected")}
            />
         </div>
         {children}
         {modal}
      </div>
   );
}
