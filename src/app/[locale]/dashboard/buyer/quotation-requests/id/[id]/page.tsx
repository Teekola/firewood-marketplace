import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { PendingOfferList } from "./_components/pending-offer-list/pending-offer-list";
import { getBuyerPendingOffersInfiniteQueryOptions } from "./_components/pending-offer-list/query-options";

export default async function BuyerQuotationRequestPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const queryClient = new QueryClient();
   await queryClient.prefetchInfiniteQuery(
      getBuyerPendingOffersInfiniteQueryOptions({ quotationRequestId: id })
   );
   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <PendingOfferList quotationRequestId={id} />
      </HydrationBoundary>
   );
}
