import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { OfferListContainer } from "./_components/offer-list";
import { getOffersInfiniteQueryOptions } from "./query-options";

export default async function SellerActiveOffersPage() {
   const queryClient = new QueryClient();
   await queryClient.prefetchInfiniteQuery(getOffersInfiniteQueryOptions({}));

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <OfferListContainer />
      </HydrationBoundary>
   );
}
