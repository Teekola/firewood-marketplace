"use client";

import { useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import { SortOrder } from "@/lib/utils/types";

import { ObjectWithId, TQueryOptions } from "../types";

interface UseInfiniteListArgs<T extends ObjectWithId> {
   queryOptions: TQueryOptions<T>;
   defaultSortOrder: SortOrder;
}
export function useInfiniteList<T extends ObjectWithId>({
   queryOptions,
   defaultSortOrder,
}: UseInfiniteListArgs<T>) {
   const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortOrder);
   const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
      useInfiniteQuery(queryOptions);

   return {
      sortOrder,
      data,
      error,
      hasNextPage,
      isFetchingNextPage,
      isFetching,
      setSortOrder,
      fetchNextPage,
   };
}
