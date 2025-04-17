import { QueryKey, UseInfiniteQueryOptions } from "@tanstack/react-query";

import { OfferDTO } from "@/db/offer";
import { SortOrder } from "@/lib/utils/types";

import { getPendingOffersForBuyerByQuotationRequestId } from "./actions";

const DEFAULT_LIMIT: number = 10;
const DEFAULT_SORT_ORDER: SortOrder = "newest-first";

type PagePending = Awaited<ReturnType<typeof getPendingOffersForBuyerByQuotationRequestId>>;

export const buyerOffersQueryKey = ["buyer-offers"];

export function getBuyerPendingOffersInfiniteQueryOptions({
   limit = DEFAULT_LIMIT,
   sortOrder = DEFAULT_SORT_ORDER,
   quotationRequestId,
}: {
   limit?: number;
   sortOrder?: SortOrder;
   quotationRequestId: string;
}): UseInfiniteQueryOptions<
   PagePending,
   Error,
   { items: OfferDTO[]; count: number },
   PagePending,
   QueryKey,
   string | null
> {
   return {
      queryKey: [...buyerOffersQueryKey, { sort: sortOrder, limit, quotationRequestId }],
      queryFn: ({ pageParam }: { pageParam: string | null }) =>
         getPendingOffersForBuyerByQuotationRequestId({
            cursor: pageParam,
            limit,
            sort: sortOrder,
            id: quotationRequestId,
         }),
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
      initialPageParam: null,
      select: (data) => ({
         items: data.pages.flatMap((p) => p.offers),
         count: data.pages[0]?.count ?? 0,
      }),
      refetchInterval: 30_000,
      staleTime: 15_000,
   };
}
