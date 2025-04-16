import { QueryKey, UseInfiniteQueryOptions } from "@tanstack/react-query";

import { OfferDTO } from "@/db/offer";
import { SortOrder } from "@/lib/utils/types";

import { getLostOffersForSeller } from "./actions";

const DEFAULT_LIMIT: number = 10;
const DEFAULT_SORT_ORDER: SortOrder = "newest-first";

type Page = Awaited<ReturnType<typeof getLostOffersForSeller>>;

export const sellerLostOffersQueryKey = ["seller-lost-offers"];

export function getLostOffersInfiniteQueryOptions({
   limit = DEFAULT_LIMIT,
   sortOrder = DEFAULT_SORT_ORDER,
}: {
   limit?: number;
   sortOrder?: SortOrder;
}): UseInfiniteQueryOptions<
   Page,
   Error,
   { items: OfferDTO[]; count: number },
   Page,
   QueryKey,
   string | null
> {
   return {
      queryKey: [...sellerLostOffersQueryKey, { sort: sortOrder, limit }],
      queryFn: ({ pageParam }: { pageParam: string | null }) =>
         getLostOffersForSeller({ cursor: pageParam, limit, sort: sortOrder }),
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
