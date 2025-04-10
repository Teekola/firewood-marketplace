import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { AcceptedOffersList } from "./_components/accepted-offers-list";
import { getAcceptedOffersForSeller } from "./actions";
import { sellerAcceptedOffersQueryKey } from "./constants";

export default async function SellerAcceptedOffersPage() {
   const queryClient = new QueryClient();
   const limit = 10;
   await queryClient.prefetchInfiniteQuery({
      queryKey: [...sellerAcceptedOffersQueryKey, { sort: "newest-first", limit }],
      queryFn: ({ pageParam = null }) => getAcceptedOffersForSeller({ cursor: pageParam, limit }),
      initialPageParam: null,
   });

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <AcceptedOffersList />
      </HydrationBoundary>
   );
}
