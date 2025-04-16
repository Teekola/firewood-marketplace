import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { OfferList } from "./_components/offer-list";
import { getOffersInfiniteQueryOptions } from "./_components/offer-list/query-options";

export default async function SellerActiveOffersPage() {
   const queryClient = new QueryClient();
   await queryClient.prefetchInfiniteQuery(getOffersInfiniteQueryOptions({}));

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <OfferList />
      </HydrationBoundary>
   );
}
