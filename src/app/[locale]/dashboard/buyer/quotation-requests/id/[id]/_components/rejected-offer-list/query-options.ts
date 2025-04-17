import { QueryKey, UseInfiniteQueryOptions } from "@tanstack/react-query";

import { OfferDTO } from "@/db/offer";
import { SortOrder } from "@/lib/utils/types";

import { getRejectedOffersForBuyerByQuotationRequestId } from "./actions";

const DEFAULT_LIMIT: number = 10;
const DEFAULT_SORT_ORDER: SortOrder = "newest-first";

type PageRejected = Awaited<ReturnType<typeof getRejectedOffersForBuyerByQuotationRequestId>>;
export const buyerRejectedOffersQueryKey = ["buyer-rejected-offers"];

export function getBuyerRejectedOffersInfiniteQueryOptions({
   limit = DEFAULT_LIMIT,
   sortOrder = DEFAULT_SORT_ORDER,
   quotationRequestId,
}: {
   limit?: number;
   sortOrder?: SortOrder;
   quotationRequestId: string;
}): UseInfiniteQueryOptions<
   PageRejected,
   Error,
   { items: OfferDTO[]; count: number },
   PageRejected,
   QueryKey,
   string | null
> {
   return {
      queryKey: [...buyerRejectedOffersQueryKey, { sort: sortOrder, limit, quotationRequestId }],
      queryFn: ({ pageParam }: { pageParam: string | null }) =>
         getRejectedOffersForBuyerByQuotationRequestId({
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
