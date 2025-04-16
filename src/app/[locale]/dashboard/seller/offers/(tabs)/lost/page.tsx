import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { LostOffersList } from "./_components/lost-offers-list";
import { getLostOffersInfiniteQueryOptions } from "./_components/query-options";

export default async function SellerLostOffersPage() {
   const queryClient = new QueryClient();
   await queryClient.prefetchInfiniteQuery(getLostOffersInfiniteQueryOptions({}));

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <LostOffersList />
      </HydrationBoundary>
   );
}
