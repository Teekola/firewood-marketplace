import { ComponentProps } from "react";

import { useTranslations } from "next-intl";

import { TUseTrackViewing } from "@/components/infinite-list/types";
import { ShortDeliveryDetails } from "@/components/quotation-request/short-delivery-details";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { RelativeTime } from "@/components/ui/relative-time";
import { BuyerQuotationRequest } from "@/db/quotation-request";
import { Link, Pathname } from "@/i18n/routing";

import { QuotationRequestTitle } from "../../../../_components/quotation-request-title";
import { SidebarNavIndicator } from "../../../../_components/sidebar-nav-indicator";

interface QuotationRequestListItemProps extends ComponentProps<"li"> {
   data: BuyerQuotationRequest;
   useTrackViewing: TUseTrackViewing;
}

export function QuotationRequestListItem({
   data: quotationRequest,
   useTrackViewing,
   ...props
}: Readonly<QuotationRequestListItemProps>) {
   const t = useTranslations();

   const visibilityRef = useTrackViewing(quotationRequest.id);

   const linkPathname: Pathname = "/dashboard/buyer/quotation-requests/id/[id]";
   return (
      <li ref={visibilityRef} {...props}>
         <Card className="relative flex flex-col justify-between gap-4 p-4 xs:flex-row">
            <div className="flex flex-col gap-2">
               <Link href={{ pathname: linkPathname, params: { id: quotationRequest.id } }}>
                  <QuotationRequestTitle
                     quotationRequest={quotationRequest}
                     className="text-left font-bold hover:underline"
                     as={CardTitle}
                  />
               </Link>

               {quotationRequest.unseenOffersCount > 0 && (
                  <div className="absolute right-0 top-1"></div>
               )}

               <ShortDeliveryDetails
                  deliveryMethods={quotationRequest.deliveryMethods}
                  deliveryCity={quotationRequest.city}
               />

               <div className="flex flex-wrap gap-4">
                  <p className="text-sm text-foreground-muted">
                     {quotationRequest.updatedAt
                        ? t("quotation-request.Last updated")
                        : t("quotation-request.Created")}{" "}
                     <RelativeTime
                        date={new Date(quotationRequest.updatedAt ?? quotationRequest.createdAt)}
                     />
                  </p>
                  <p className="text-sm font-bold text-foreground-muted">
                     {t("quotation-request.number-of-offers", {
                        count: quotationRequest._count.offers,
                     })}
                  </p>
               </div>
            </div>
            <div className="flex flex-col items-end">
               <Button asChild variant="outline" className="my-auto">
                  <Link href={{ pathname: linkPathname, params: { id: quotationRequest.id } }}>
                     {t("View")}
                     {quotationRequest.unseenOffersCount > 0 && (
                        <>
                           {" "}
                           <SidebarNavIndicator
                              number={quotationRequest.unseenOffersCount}
                              className="static ml-2"
                           />
                        </>
                     )}
                  </Link>
               </Button>
            </div>
         </Card>
      </li>
   );
}
