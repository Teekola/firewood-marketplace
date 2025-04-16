"use client";

import { useTranslations } from "next-intl";

import { SortOrder } from "@/lib/utils/types";

import { InfiniteListHeader } from "./_components/infinite-list-header";
import { InfiniteListList } from "./_components/infinite-list-list";
import { useInfiniteList } from "./_hooks/use-infinite-list";
import { ObjectWithId, TListItemComponent, TQueryOptions, TViewItemsFn } from "./types";

const DEFAULT_SORT_ORDER: SortOrder = "newest-first";

interface InfiniteListProps<T extends ObjectWithId> {
   queryOptions: TQueryOptions<T>;
   ListItemComponent: TListItemComponent<T>;
   viewItems: TViewItemsFn;
   defaultSortOrder?: SortOrder;
}
export function InfiniteList<T extends ObjectWithId>({
   queryOptions,
   ListItemComponent,
   viewItems,
   defaultSortOrder = DEFAULT_SORT_ORDER,
}: InfiniteListProps<T>) {
   const {
      sortOrder,
      setSortOrder,
      isFetching,
      data,
      fetchNextPage,
      isFetchingNextPage,
      hasNextPage,
   } = useInfiniteList<T>({ queryOptions, defaultSortOrder });
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
            isFetchingNextPage={isFetchingNextPage}
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
