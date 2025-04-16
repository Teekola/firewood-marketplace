import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { RejectedQuotationRequestList } from "../../_components/rejected-quotation-request-list";
import { getRejectedQuotationRequestsInfiniteQueryOptions } from "../../_components/rejected-quotation-request-list/query-options";

export default async function RejectedQuotationRequestsPage() {
   const queryClient = new QueryClient();

   await queryClient.prefetchInfiniteQuery(getRejectedQuotationRequestsInfiniteQueryOptions({}));

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <RejectedQuotationRequestList />
      </HydrationBoundary>
   );
}
