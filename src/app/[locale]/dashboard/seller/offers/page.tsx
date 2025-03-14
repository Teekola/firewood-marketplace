import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { OfferList } from "./(components)/offer-list";
import { getActiveOffersForSeller } from "./actions";
import { sellerOffersQueryKey } from "./constants";

export default async function SellerQuotationRequestsPage() {
   const queryClient = new QueryClient();
   const limit = 10;
   await queryClient.prefetchInfiniteQuery({
      queryKey: [...sellerOffersQueryKey, { sort: "newest-first", limit }],
      queryFn: ({ pageParam = null }) => getActiveOffersForSeller({ cursor: pageParam, limit }),
      initialPageParam: null,
   });
   const t = await getTranslations();
   return (
      <div className="w-full">
         <h1 className="h3">{t("offers.Sent Offers")}</h1>
         <HydrationBoundary state={dehydrate(queryClient)}>
            <OfferList />
         </HydrationBoundary>
      </div>
   );
}
