import { QueryKey, UseInfiniteQueryOptions } from "@tanstack/react-query";

import { SortOrder } from "@/lib/utils/types";

import { getPendingQuotationRequestsForSeller } from "../../actions";

const DEFAULT_LIMIT: number = 10;
const DEFAULT_SORT_ORDER: SortOrder = "newest-first";

type Page = Awaited<ReturnType<typeof getPendingQuotationRequestsForSeller>>;
export const sellerQuotationRequestsQueryKey = ["seller-quotation-requests"];
export type SellerQuotationRequest = Awaited<
   ReturnType<typeof getPendingQuotationRequestsForSeller>
>["requests"][number];

export function getQuotationRequestsInfiniteQueryOptions({
   limit = DEFAULT_LIMIT,
   sortOrder = DEFAULT_SORT_ORDER,
}: {
   limit?: number;
   sortOrder?: SortOrder;
}): UseInfiniteQueryOptions<
   Page,
   Error,
   {
      items: Awaited<ReturnType<typeof getPendingQuotationRequestsForSeller>>["requests"];
      count: number;
   },
   Page,
   QueryKey,
   string | null
> {
   return {
      queryKey: [...sellerQuotationRequestsQueryKey, { sort: sortOrder, limit }],
      queryFn: ({ pageParam }: { pageParam: string | null }) =>
         getPendingQuotationRequestsForSeller({ cursor: pageParam, limit, sort: sortOrder }),
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
      initialPageParam: null,
      select: (data) => ({
         items: data.pages.flatMap((p) => p.requests),
         count: data.pages[0]?.count ?? 0,
      }),
      refetchInterval: 30_000,
      staleTime: 15_000,
   };
}
