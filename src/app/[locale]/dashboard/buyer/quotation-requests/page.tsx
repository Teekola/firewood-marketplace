import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { QuotationRequestList } from "./(components)/quotation-request-list";
import { getPendingQuotationRequestsForBuyer } from "./actions";
import { buyerQuotationRequestsQueryKey } from "./constants";

const limit = 10;
export default async function BuyerQuotationRequestsPage() {
   const queryClient = new QueryClient();
   await queryClient.prefetchInfiniteQuery({
      queryKey: [...buyerQuotationRequestsQueryKey, { sort: "newest-first", limit }],
      queryFn: ({ pageParam = null }) =>
         getPendingQuotationRequestsForBuyer({ cursor: pageParam, limit }),
      initialPageParam: null,
   });
   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <QuotationRequestList />
      </HydrationBoundary>
   );
}
