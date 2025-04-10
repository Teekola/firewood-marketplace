import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { OfferList } from "../_components/offer-list/offer-list";
import { OfferListItemRejected } from "../_components/offer-list/offer-list-item-rejected";
import { getRejectedOffersForBuyerByQuotationRequestId } from "../actions";
import { buyerRejectedOffersQueryKey } from "../constants";

const limit = 10;
export default async function BuyerQuotationRequestRejectedOffersPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const t = await getTranslations();
   const queryClient = new QueryClient();
   await queryClient.prefetchInfiniteQuery({
      queryKey: [...buyerRejectedOffersQueryKey, { sort: "newest-first", limit, id }],
      queryFn: ({ pageParam = null }) =>
         getRejectedOffersForBuyerByQuotationRequestId({
            cursor: pageParam,
            limit,
            sort: "newest-first",
            id,
         }),
      initialPageParam: null,
   });
   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <OfferList
            queryKey={buyerRejectedOffersQueryKey}
            queryFn={getRejectedOffersForBuyerByQuotationRequestId}
            ListItem={OfferListItemRejected}
            emptyText={t("offer.No rejected offers")}
         />
      </HydrationBoundary>
   );
}
