import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { getQuotationRequestsForSeller } from "./actions";
import { QuotationRequestsList, sellerQuotationRequestsQueryKey } from "./quotation-requests-list";

export default async function SellerQuotationRequestsPage() {
   const queryClient = new QueryClient();
   await queryClient.prefetchQuery({
      queryKey: [sellerQuotationRequestsQueryKey],
      queryFn: getQuotationRequestsForSeller,
   });
   return (
      <div>
         <HydrationBoundary state={dehydrate(queryClient)}>
            <QuotationRequestsList />
         </HydrationBoundary>
      </div>
   );
}
