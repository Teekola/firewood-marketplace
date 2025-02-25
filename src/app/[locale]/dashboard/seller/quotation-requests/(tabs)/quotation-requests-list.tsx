"use client";

import { useEffect, useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowUpDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { SortOrder } from "@/lib/utils/types";

import { getPendingQuotationRequestsForSeller } from "../actions";
import { sellerQuotationRequestsQueryKey } from "../constants";
import { QuotationRequestListItem } from "./quotation-request-list-item";

export function QuotationRequestsList() {
   const t = useTranslations();
   const limit = 10; // Number of items per page
   const { ref, inView } = useInView();
   const [sortOrder, setSortOrder] = useState<SortOrder>("newest-first");

   const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
      useInfiniteQuery({
         queryKey: [...sellerQuotationRequestsQueryKey, { sort: sortOrder, limit }],
         queryFn: ({ pageParam }: { pageParam: string | null }) =>
            getPendingQuotationRequestsForSeller({ cursor: pageParam, limit, sort: sortOrder }),
         getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
         initialPageParam: null,
         refetchInterval: 30 * 1000,
         staleTime: 15 * 1000,
      });

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

   if (requests.length === 0 && !isFetching) {
      return <p>{t("quotation-request.There are no pending quotation requests")}</p>;
   }

   return (
      <div className="flex flex-col gap-1">
         <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
            <SelectTrigger
               className="mb-2 max-w-32 self-end"
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
         {isFetching && requests.length === 0 && (
            <p className="animate-pulse py-4 text-center text-sm">{t("pagination.Loading more")}</p>
         )}
         <ul className="flex min-h-20 w-full flex-col gap-1">
            {requests.map((sqr, index) => (
               <QuotationRequestListItem
                  key={sqr.id}
                  quotationRequest={sqr.quotationRequest}
                  ref={index === requests.length - 1 ? ref : null}
               />
            ))}
         </ul>

         {isFetchingNextPage && (
            <p className="animate-pulse py-4 text-center text-sm">{t("pagination.Loading more")}</p>
         )}
      </div>
   );
}
