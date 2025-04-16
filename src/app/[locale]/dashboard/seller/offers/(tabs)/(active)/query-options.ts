import { QueryKey, UseInfiniteQueryOptions } from "@tanstack/react-query";

import { OfferDTO } from "@/db/offer";
import { SortOrder } from "@/lib/utils/types";

import { getActiveOffersForSeller } from "./actions";

const DEFAULT_LIMIT: number = 10;
const DEFAULT_SORT_ORDER: SortOrder = "newest-first";

type Page = Awaited<ReturnType<typeof getActiveOffersForSeller>>;

export function getOffersInfiniteQueryOptions({
   limit = DEFAULT_LIMIT,
   sortOrder = DEFAULT_SORT_ORDER,
}: {
   limit?: number;
   sortOrder?: SortOrder;
}): UseInfiniteQueryOptions<
   Page,
   Error,
   { offers: OfferDTO[]; count: number },
   Page,
   QueryKey,
   string | null
> {
   return {
      queryKey: ["seller-offers", { sortOrder, limit }],
      queryFn: ({ pageParam = null }) => getActiveOffersForSeller({ cursor: pageParam, limit }),
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
      select: (data) => ({
         offers: data.pages.flatMap((p) => p.offers),
         count: data.pages[0]?.count ?? 0,
      }),
      refetchInterval: 30_000,
      staleTime: 15_000,
   };
}
