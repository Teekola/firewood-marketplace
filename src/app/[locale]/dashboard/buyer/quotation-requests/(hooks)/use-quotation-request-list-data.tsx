"use client";

import { useState } from "react";

import { QuotationRequestStatus } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { SortOrder } from "@/lib/utils/types";

import { getQuotationRequestsForBuyer } from "../actions";
import { buyerQuotationRequestsQueryKey } from "../constants";

const limit = 10; // Number of items per page
export function useQuotationRequestListData({
   status,
}: Readonly<{ status: QuotationRequestStatus }>) {
   const [sortOrder, setSortOrder] = useState<SortOrder>("newest-first");
   const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
      useInfiniteQuery({
         queryKey: [...buyerQuotationRequestsQueryKey, { sort: sortOrder, limit, status }],
         queryFn: ({ pageParam }: { pageParam: string | null }) =>
            getQuotationRequestsForBuyer({ cursor: pageParam, limit, sort: sortOrder, status }),
         getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
         initialPageParam: null,
         refetchInterval: 30 * 1000,
         staleTime: 15 * 1000,
      });

   const requests = data?.pages.flatMap((page) => page.requests) || [];
   const count = data?.pages[0].count;
   return {
      data,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isFetching,
      sortOrder,
      setSortOrder,
      requests,
      count,
   };
}
