import { QuotationRequestStatus } from "@prisma/client";
import { QueryKey, UseInfiniteQueryOptions } from "@tanstack/react-query";

import { BuyerQuotationRequest } from "@/db/quotation-request";
import { SortOrder } from "@/lib/utils/types";

import { getQuotationRequestsForBuyer } from "./actions";

const DEFAULT_LIMIT: number = 10;
const DEFAULT_SORT_ORDER: SortOrder = "newest-first";

export const buyerQuotationRequestsQueryKey = ["buyer-quotation-requests"];

type Page = Awaited<ReturnType<typeof getQuotationRequestsForBuyer>>;

export const sellerLostOffersQueryKey = ["seller-lost-offers"];

export function getBuyerQuotationRequestInfiniteQueryOptions({
   limit = DEFAULT_LIMIT,
   sortOrder = DEFAULT_SORT_ORDER,
   status,
}: {
   limit?: number;
   sortOrder?: SortOrder;
   status: QuotationRequestStatus;
}): UseInfiniteQueryOptions<
   Page,
   Error,
   { items: BuyerQuotationRequest[]; count: number },
   Page,
   QueryKey,
   string | null
> {
   return {
      queryKey: [...buyerQuotationRequestsQueryKey, { sort: sortOrder, limit, status }],
      queryFn: ({ pageParam }: { pageParam: string | null }) =>
         getQuotationRequestsForBuyer({
            cursor: pageParam,
            limit,
            sort: sortOrder,
            status,
         }),
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
