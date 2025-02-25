import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { getRejectedQuotationRequestsForSeller } from "../../actions";
import { sellerRejectedQuotationRequestsQueryKey } from "../../constants";
import { RejectedQuotationRequestsList } from "./rejected-quotation-requests-list";

export default async function RejectedQuotationRequestsPage() {
   const queryClient = new QueryClient();
   const limit = 10;
   await queryClient.prefetchInfiniteQuery({
      queryKey: [...sellerRejectedQuotationRequestsQueryKey, { sort: "newest-first", limit }],
      queryFn: ({ pageParam = null }) =>
         getRejectedQuotationRequestsForSeller({ cursor: pageParam, limit }),
      initialPageParam: null,
   });

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <RejectedQuotationRequestsList />
      </HydrationBoundary>
   );
}
