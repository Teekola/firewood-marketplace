import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { OfferList } from "../(components)/offer-list";
import { getActiveOffersForSeller } from "../actions";
import { sellerOffersQueryKey } from "../constants";

export default async function SellerActiveOffersPage() {
   const queryClient = new QueryClient();
   const limit = 10;
   await queryClient.prefetchInfiniteQuery({
      queryKey: [...sellerOffersQueryKey, { sort: "newest-first", limit }],
      queryFn: ({ pageParam = null }) => getActiveOffersForSeller({ cursor: pageParam, limit }),
      initialPageParam: null,
   });

   return (
      <div className="w-full">
         <HydrationBoundary state={dehydrate(queryClient)}>
            <OfferList />
         </HydrationBoundary>
      </div>
   );
}
