"use client";

import { useEffect, useState } from "react";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SortOrder } from "@/lib/utils/types";

import { getRejectedQuotationRequestsForSeller, restoreQuotationRequest } from "../../actions";
import {
   sellerQuotationRequestsQueryKey,
   sellerRejectedQuotationRequestsQueryKey,
} from "../../constants";
import { RejectedQuotationRequestListItem } from "./rejected-quotation-request-list-item";

export function RejectedQuotationRequestsList() {
   const t = useTranslations();
   const limit = 10; // Number of items per page
   const { ref, inView } = useInView();
   const [sortOrder, setSortOrder] = useState<SortOrder>("newest-first");
   const queryClient = useQueryClient();

   const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
      useInfiniteQuery({
         queryKey: [...sellerRejectedQuotationRequestsQueryKey, { sort: sortOrder, limit }],
         queryFn: ({ pageParam }: { pageParam: string | null }) =>
            getRejectedQuotationRequestsForSeller({ cursor: pageParam, limit, sort: sortOrder }),
         getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
         initialPageParam: null,
         refetchInterval: 30 * 1000,
         staleTime: 15 * 1000,
      });

   async function restoreItem(quotationRequestId: string) {
      const previousData = queryClient.getQueryData([
         ...sellerRejectedQuotationRequestsQueryKey,
         { sort: sortOrder, limit },
      ]);
      queryClient.invalidateQueries({ queryKey: [...sellerQuotationRequestsQueryKey] });
      try {
         // Optimistic update (TODO: Add types for the any)
         queryClient.setQueryData(
            [...sellerRejectedQuotationRequestsQueryKey, { sort: sortOrder, limit }],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (oldData: any) => {
               if (!oldData) return oldData;
               return {
                  ...oldData,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  pages: oldData.pages.map((page: any) => ({
                     ...page,
                     count: page.count - 1,
                     requests: page.requests.filter(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (req: any) => req.quotationRequest.id !== quotationRequestId
                     ),
                  })),
               };
            }
         );

         await restoreQuotationRequest(quotationRequestId);
      } catch (error) {
         console.error(error);

         queryClient.setQueryData(
            [...sellerRejectedQuotationRequestsQueryKey, { sort: sortOrder, limit }],
            previousData
         );
      }
   }

   // Fetch next page when the last item is in view
   useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
         fetchNextPage();
      }
   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

   if (error) {
      return <p>{error.message}</p>;
   }

   const requests = data?.pages.flatMap((page) => page.requests) || [];
   const count = data?.pages[0].count;

   return (
      <div className="flex h-full flex-col gap-1 overflow-hidden">
         <div className="flex items-center gap-2">
            {count === 0 && !isFetching && (
               <p className="text-sm text-muted-foreground">
                  {t("quotation-request.There are no rejected quotation requests")}
               </p>
            )}
            {count !== undefined && count > 0 && (
               <p className="text-sm text-muted-foreground">
                  {t("pagination.displayed-results", { displayed: requests.length, total: count })}{" "}
               </p>
            )}
            {isFetching && (
               <p className="animate-pulse text-center text-sm text-muted-foreground">
                  {t("pagination.Loading")}
               </p>
            )}

            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
               <SelectTrigger
                  className="ml-auto max-w-32"
                  icon={<ArrowUpDownIcon className="h-4 w-4 opacity-50" />}
               >
                  <SelectValue asChild>
                     <p>{t(`sorting.${sortOrder}`)}</p>
                  </SelectValue>
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="newest-first">{t("sorting.newest-first")}</SelectItem>
                  <SelectItem value="oldest-first">{t("sorting.oldest-first")}</SelectItem>
               </SelectContent>
            </Select>
         </div>

         <ScrollArea className="relative min-h-64 pr-3">
            <div
               className="pointer-events-none sticky top-0 h-5 w-full bg-gradient-to-b from-background via-background to-transparent"
               aria-hidden="true"
            ></div>
            <ul className="flex min-h-20 w-full flex-col gap-1">
               {isFetching && requests.length === 0 && (
                  <>
                     <Skeleton className="h-[106px] w-full min-w-10" />
                     <Skeleton className="h-[106px] w-full min-w-10" />
                     <Skeleton className="h-[106px] w-full min-w-10" />
                     <Skeleton className="h-[106px] w-full min-w-10" />
                     <Skeleton className="h-[106px] w-full min-w-10" />
                  </>
               )}
               {requests.map((sqr, index) => (
                  <RejectedQuotationRequestListItem
                     key={sqr.id}
                     restoreItem={restoreItem}
                     quotationRequest={sqr.quotationRequest}
                     ref={index === requests.length - 1 ? ref : null}
                  />
               ))}
            </ul>
         </ScrollArea>

         {isFetchingNextPage && (
            <p className="animate-pulse py-4 text-center text-sm">{t("pagination.Loading")}</p>
         )}
      </div>
   );
}
