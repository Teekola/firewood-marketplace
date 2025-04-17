"use client";

import React, { Fragment } from "react";

import { useInfiniteScroll } from "@/components/infinite-list/_hooks/use-infinite-scroll";
import { ScrollArea } from "@/ui/scroll-area";

import { useViewItems } from "../_hooks/use-view-items";
import { ObjectWithId, TListItemComponent, TViewItemsFn } from "../types";

interface InfiniteListProps<T extends ObjectWithId> {
   items: Array<T>;
   ListItemComponent: TListItemComponent<T>;
   emptyStateComponent?: React.ReactNode;
   loadingStateComponent?: React.ReactNode;
   isFetching?: boolean;
   hasNextPage?: boolean;
   isFetchingNextPage?: boolean;
   fetchNextPage: () => void;
   viewItems: TViewItemsFn;
}

export function InfiniteListList<T extends ObjectWithId>({
   items,
   ListItemComponent,
   emptyStateComponent,
   loadingStateComponent,
   isFetching,
   hasNextPage,
   isFetchingNextPage,
   fetchNextPage,
   viewItems,
   ...props
}: InfiniteListProps<T>) {
   const { ref } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });
   const { useTrackViewing } = useViewItems({ viewItems });
   return (
      <ScrollArea {...props} className="min-h-64">
         {items.length === 0 && !isFetching && emptyStateComponent}
         <ul className="flex min-h-20 w-full flex-col gap-1 pr-3">
            {isFetching && items.length === 0 && loadingStateComponent}
            {items.map((item, index) => {
               const isLast = index === items.length - 1;
               return (
                  <Fragment key={item.id}>
                     <ListItemComponent data={item} useTrackViewing={useTrackViewing} />
                     {isLast && <div ref={ref}></div>}
                  </Fragment>
               );
            })}
         </ul>
      </ScrollArea>
   );
}
