import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { getQuotationRequestsForSeller } from "./actions";
import { QuotationRequestsList } from "./quotation-requests-list";

export const sellerQuotationRequestsQueryKey = ["seller-quotation-requests"];

export default async function SellerQuotationRequestsPage() {
   const queryClient = new QueryClient();
   await queryClient.prefetchQuery({
      queryKey: sellerQuotationRequestsQueryKey,
      queryFn: getQuotationRequestsForSeller,
   });

   return (
      <div className="w-full">
         <HydrationBoundary state={dehydrate(queryClient)}>
            <QuotationRequestsList />
         </HydrationBoundary>
      </div>
   );
}
