import { QuotationRequestStatus } from "@prisma/client";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { getBuyerQuotationRequestInfiniteQueryOptions } from "../_components/quotation-request-list/query-options";
import { QuotationRequestList } from "../_components/quotation-request-list/quotation-request-list";
import { QuotationRequestListEmptyState } from "../_components/quotation-request-list/quotation-request-list-empty-state";

const status: QuotationRequestStatus = QuotationRequestStatus.PENDING;
export default async function BuyerQuotationRequestsPage() {
   const queryClient = new QueryClient();
   await queryClient.prefetchInfiniteQuery(
      getBuyerQuotationRequestInfiniteQueryOptions({ status })
   );
   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <QuotationRequestList
            status={status}
            emptyStateComponent={<QuotationRequestListEmptyState />}
         />
      </HydrationBoundary>
   );
}
