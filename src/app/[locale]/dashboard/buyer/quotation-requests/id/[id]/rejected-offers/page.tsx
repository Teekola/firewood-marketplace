import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { getBuyerRejectedOffersInfiniteQueryOptions } from "../_components/rejected-offer-list/query-options";
import { RejectedOfferList } from "../_components/rejected-offer-list/rejected-offer-list";

export default async function BuyerQuotationRequestRejectedOffersPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;

   const queryClient = new QueryClient();
   await queryClient.prefetchInfiniteQuery(
      getBuyerRejectedOffersInfiniteQueryOptions({ quotationRequestId: id })
   );
   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <RejectedOfferList quotationRequestId={id} />
      </HydrationBoundary>
   );
}
