"use client";

import { useEffect } from "react";

import { QuotationRequestStatus } from "@prisma/client";
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

import { QuotationRequestListItem } from "../(components)/quotation-request-list-item";
import { useQuotationRequestListData } from "../(hooks)/use-quotation-request-list-data";

export function QuotationRequestList({
   status,
   emptyState,
}: Readonly<{ status: QuotationRequestStatus; emptyState: React.ReactNode }>) {
   const t = useTranslations();
   const { ref, inView } = useInView();

   const {
      data,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isFetching,
      sortOrder,
      setSortOrder,
   } = useQuotationRequestListData({ status });

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
      <div className="flex h-full w-full flex-col gap-1 overflow-hidden">
         <div className="flex items-center gap-2">
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
                  className="m-1 ml-auto max-w-32"
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
            {count === 0 && !isFetching && emptyState}
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
               {requests.map((qr, index) => (
                  <QuotationRequestListItem
                     key={qr.id}
                     quotationRequest={qr}
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
