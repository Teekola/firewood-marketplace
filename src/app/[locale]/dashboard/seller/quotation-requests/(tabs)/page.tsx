import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { getPendingQuotationRequestsForSeller } from "../actions";
import { sellerQuotationRequestsQueryKey } from "../constants";
import { QuotationRequestsList } from "./quotation-requests-list";

export default async function SellerQuotationRequestsPage() {
   const queryClient = new QueryClient();
   await queryClient.prefetchInfiniteQuery({
      queryKey: [...sellerQuotationRequestsQueryKey, "newest-first"],
      queryFn: ({ pageParam = null }) =>
         getPendingQuotationRequestsForSeller({ cursor: pageParam, limit: 10 }),
      initialPageParam: null,
   });

   return (
      <div className="w-full">
         <HydrationBoundary state={dehydrate(queryClient)}>
            <QuotationRequestsList />
         </HydrationBoundary>
      </div>
   );
}
