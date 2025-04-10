"use client";

import { useState } from "react";

import { useParams } from "next/navigation";

import { useInfiniteQuery } from "@tanstack/react-query";

import { SortOrder } from "@/lib/utils/types";

import { getPendingOffersForBuyerByQuotationRequestId } from "../../actions";
import { buyerOffersQueryKey } from "../../constants";

const limit = 10; // Number of items per page
export function useOfferListData({
   queryFn = getPendingOffersForBuyerByQuotationRequestId,
   queryKey = buyerOffersQueryKey,
}) {
   const params = useParams();
   const id = params.id as string;

   const [sortOrder, setSortOrder] = useState<SortOrder>("newest-first");
   const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
      useInfiniteQuery({
         queryKey: [...queryKey, { sort: sortOrder, limit, id }],
         queryFn: ({ pageParam }: { pageParam: string | null }) =>
            queryFn({
               cursor: pageParam,
               limit,
               sort: sortOrder,
               id,
            }),
         getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
         initialPageParam: null,
         refetchInterval: 30 * 1000,
         staleTime: 15 * 1000,
      });

   const offers = data?.pages.flatMap((page) => page.offers) || [];
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
      offers,
      count,
   };
}
