import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { OfferList } from "./(components)/offer-list/offer-list";
import { getPendingOffersForBuyerByQuotationRequestId } from "./actions";
import { buyerOffersQueryKey } from "./constants";

const limit = 10;
export default async function BuyerQuotationRequestPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const queryClient = new QueryClient();
   await queryClient.prefetchInfiniteQuery({
      queryKey: [...buyerOffersQueryKey, { sort: "newest-first", limit, id }],
      queryFn: ({ pageParam = null }) =>
         getPendingOffersForBuyerByQuotationRequestId({
            cursor: pageParam,
            limit,
            sort: "newest-first",
            id,
         }),
      initialPageParam: null,
   });
   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <OfferList />
      </HydrationBoundary>
   );
}
