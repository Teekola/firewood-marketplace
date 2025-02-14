import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { getPendingQuotationRequestsForSeller } from "./actions";
import { sellerQuotationRequestsQueryKey } from "./constants";
import { QuotationRequestsList } from "./quotation-requests-list";

export default async function SellerQuotationRequestsPage() {
   const queryClient = new QueryClient();
   await queryClient.prefetchQuery({
      queryKey: sellerQuotationRequestsQueryKey,
      queryFn: getPendingQuotationRequestsForSeller,
   });

   return (
      <div className="w-full">
         <HydrationBoundary state={dehydrate(queryClient)}>
            <QuotationRequestsList />
         </HydrationBoundary>
      </div>
   );
}
