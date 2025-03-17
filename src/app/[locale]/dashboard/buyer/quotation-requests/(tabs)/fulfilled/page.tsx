import { QuotationRequestStatus } from "@prisma/client";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { QuotationRequestList } from "../../(components)/quotation-request-list";
import { getQuotationRequestsForBuyer } from "../../actions";
import { buyerQuotationRequestsQueryKey } from "../../constants";

const limit = 10;
const status = QuotationRequestStatus.FULFILLED;
export default async function BuyerFulfilledQuotationRequestsPage() {
   const queryClient = new QueryClient();
   const t = await getTranslations();
   await queryClient.prefetchInfiniteQuery({
      queryKey: [...buyerQuotationRequestsQueryKey, { sort: "newest-first", limit, status }],
      queryFn: ({ pageParam = null }) =>
         getQuotationRequestsForBuyer({
            cursor: pageParam,
            limit,
            status,
         }),
      initialPageParam: null,
   });
   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <QuotationRequestList
            status={status}
            emptyState={
               <p className="text-center text-sm text-muted-foreground">
                  {t("quotation-requests.No fulfilled requests")}
               </p>
            }
         />
      </HydrationBoundary>
   );
}
