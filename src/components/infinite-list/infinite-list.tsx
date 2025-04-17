"use client";

import React from "react";

import { useTranslations } from "next-intl";

import { SortOrder } from "@/lib/utils/types";

import { InfiniteListHeader } from "./_components/infinite-list-header";
import { InfiniteListList } from "./_components/infinite-list-list";
import { useInfiniteList } from "./_hooks/use-infinite-list";
import { ObjectWithId, TListItemComponent, TQueryOptions, TViewItemsFn } from "./types";

const DEFAULT_SORT_ORDER: SortOrder = "newest-first";
const DEFAULT_LIMIT: number = 10;

interface InfiniteListProps<T extends ObjectWithId> {
   getQueryOptions: ({
      sortOrder,
      limit,
   }: {
      sortOrder: SortOrder;
      limit: number;
   }) => TQueryOptions<T>;
   ListItemComponent: TListItemComponent<T>;
   emptyStateComponent?: React.ReactNode;
   loadingStateComponent?: React.ReactNode;
   viewItems: TViewItemsFn;
   defaultSortOrder?: SortOrder;
   defaultLimit?: number;
}
export function InfiniteList<T extends ObjectWithId>({
   getQueryOptions,
   ListItemComponent,
   loadingStateComponent,
   emptyStateComponent,
   viewItems,
   defaultSortOrder = DEFAULT_SORT_ORDER,
   defaultLimit = DEFAULT_LIMIT,
}: InfiniteListProps<T>) {
   const {
      sortOrder,
      setSortOrder,
      isFetching,
      data,
      fetchNextPage,
      isFetchingNextPage,
      hasNextPage,
   } = useInfiniteList<T>({ getQueryOptions, defaultSortOrder, defaultLimit });
   const t = useTranslations();
   const items = data?.items ?? [];
   const count = data?.count ?? 0;
   return (
      <div className="flex flex-1 flex-col gap-1">
         <InfiniteListHeader
            totalCount={count}
            displayedCount={items.length}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            isFetching={isFetching}
         />
         <InfiniteListList
            items={items}
            ListItemComponent={ListItemComponent}
            emptyStateComponent={emptyStateComponent}
            loadingStateComponent={loadingStateComponent}
            isFetchingNextPage={isFetchingNextPage}
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            viewItems={viewItems}
         />
         {isFetchingNextPage && (
            <p className="animate-pulse text-sm text-foreground-muted">{t("pagination.Loading")}</p>
         )}
      </div>
   );
}
