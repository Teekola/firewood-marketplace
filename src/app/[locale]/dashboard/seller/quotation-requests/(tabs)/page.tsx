import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { getPendingQuotationRequestsForSeller } from "../actions";
import { sellerQuotationRequestsQueryKey } from "../constants";
import { QuotationRequestsList } from "./quotation-requests-list";

export default async function SellerQuotationRequestsPage() {
   const queryClient = new QueryClient();
   const limit = 10;
   await queryClient.prefetchInfiniteQuery({
      queryKey: [...sellerQuotationRequestsQueryKey, { sort: "newest-first", limit }],
      queryFn: ({ pageParam = null }) =>
         getPendingQuotationRequestsForSeller({ cursor: pageParam, limit }),
      initialPageParam: null,
   });

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <QuotationRequestsList />
      </HydrationBoundary>
   );
}
