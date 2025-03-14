import { QuotationRequestStatus } from "@prisma/client";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { QuotationRequestList } from "../(components)/quotation-request-list";
import { QuotationRequestListEmptyState } from "../(components)/quotation-request-list-empty-state";
import { getQuotationRequestsForBuyer } from "../actions";
import { buyerQuotationRequestsQueryKey } from "../constants";

const limit = 10;
const status = QuotationRequestStatus.PENDING;
export default async function BuyerQuotationRequestsPage() {
   const queryClient = new QueryClient();
   await queryClient.prefetchInfiniteQuery({
      queryKey: [...buyerQuotationRequestsQueryKey, { sort: "newest-first", limit, status }],
      queryFn: ({ pageParam = null }) =>
         getQuotationRequestsForBuyer({ cursor: pageParam, limit, status }),
      initialPageParam: null,
   });
   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <QuotationRequestList status={status} emptyState={<QuotationRequestListEmptyState />} />
      </HydrationBoundary>
   );
}
