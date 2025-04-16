"use client";

import { useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import { SortOrder } from "@/lib/utils/types";

import { ObjectWithId, TQueryOptions } from "../types";

interface UseInfiniteListArgs<T extends ObjectWithId> {
   getQueryOptions: ({
      sortOrder,
      limit,
   }: {
      sortOrder: SortOrder;
      limit: number;
   }) => TQueryOptions<T>;
   defaultSortOrder: SortOrder;
   defaultLimit: number;
}
export function useInfiniteList<T extends ObjectWithId>({
   getQueryOptions,
   defaultSortOrder,
   defaultLimit,
}: UseInfiniteListArgs<T>) {
   const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortOrder);
   const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
      useInfiniteQuery(getQueryOptions({ sortOrder, limit: defaultLimit }));

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
