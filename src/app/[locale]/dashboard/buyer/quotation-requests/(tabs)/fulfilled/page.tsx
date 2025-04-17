import { QuotationRequestStatus } from "@prisma/client";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { getBuyerQuotationRequestInfiniteQueryOptions } from "../../_components/quotation-request-list/query-options";
import { QuotationRequestList } from "../../_components/quotation-request-list/quotation-request-list";

const status: QuotationRequestStatus = QuotationRequestStatus.FULFILLED;
export default async function BuyerFulfilledQuotationRequestsPage() {
   const queryClient = new QueryClient();

   await queryClient.prefetchInfiniteQuery(
      getBuyerQuotationRequestInfiniteQueryOptions({ status })
   );
   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <QuotationRequestList status={status} />
      </HydrationBoundary>
   );
}
