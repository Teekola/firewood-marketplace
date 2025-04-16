import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { PendingQuotationRequestList } from "../_components/pending-quotation-request-list";
import { getQuotationRequestsInfiniteQueryOptions } from "../_components/pending-quotation-request-list/query-options";

export default async function SellerQuotationRequestsPage() {
   const queryClient = new QueryClient();
   await queryClient.prefetchInfiniteQuery(getQuotationRequestsInfiniteQueryOptions({}));

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <PendingQuotationRequestList />
      </HydrationBoundary>
   );
}
