import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { AcceptedOffersList } from "./_components/accepted-offers-list";
import { getAcceptedOffersInfiniteQueryOptions } from "./_components/query-options";

export default async function SellerAcceptedOffersPage() {
   const queryClient = new QueryClient();
   await queryClient.prefetchInfiniteQuery(getAcceptedOffersInfiniteQueryOptions({}));

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <AcceptedOffersList />
      </HydrationBoundary>
   );
}
