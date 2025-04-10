import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { LostOffersList } from "./_components/lost-offers-list";
import { getLostOffersForSeller } from "./actions";
import { sellerLostOffersQueryKey } from "./constants";

export default async function SellerLostOffersPage() {
   const queryClient = new QueryClient();
   const limit = 10;
   await queryClient.prefetchInfiniteQuery({
      queryKey: [...sellerLostOffersQueryKey, { sort: "newest-first", limit }],
      queryFn: ({ pageParam = null }) => getLostOffersForSeller({ cursor: pageParam, limit }),
      initialPageParam: null,
   });

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <LostOffersList />
      </HydrationBoundary>
   );
}
