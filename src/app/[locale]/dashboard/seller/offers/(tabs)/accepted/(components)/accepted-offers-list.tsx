"use client";

import { Fragment, useEffect, useMemo, useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
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

import { useUpdateSellerLastSeen } from "../../(hooks)/use-update-seller-last-seen";
import { getAcceptedOffersForSeller } from "../actions";
import { sellerAcceptedOffersQueryKey } from "../constants";
import { AcceptedOfferListItem } from "./accepted-offer-list-item";

const limit = 10; // Number of items per page
export function AcceptedOffersList() {
   const t = useTranslations();
   const { ref, inView } = useInView();
   const [sortOrder, setSortOrder] = useState<SortOrder>("newest-first");

   const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
      useInfiniteQuery({
         queryKey: [...sellerAcceptedOffersQueryKey, { sort: sortOrder, limit }],
         queryFn: ({ pageParam }: { pageParam: string | null }) =>
            getAcceptedOffersForSeller({ cursor: pageParam, limit, sort: sortOrder }),
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

   const count = data?.pages[0].count;
   const offers = useMemo(() => data?.pages.flatMap((page) => page.offers) ?? [], [data]);
   const { useTrackOfferVisibility } = useUpdateSellerLastSeen();

   if (error) {
      return <p>{error.message}</p>;
   }

   return (
      <div className="mb-6 flex h-full w-full flex-col gap-1 sm:max-h-[calc(100vh-180px)]">
         <div className="flex items-center gap-2">
            {count === 0 && !isFetching && (
               <p className="text-sm text-muted-foreground">
                  {t("offer.There are no accepted offers")}
               </p>
            )}
            {count !== undefined && count > 0 && (
               <p className="text-sm text-muted-foreground">
                  {t("pagination.displayed-results", { displayed: offers.length, total: count })}{" "}
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
            <ul className="flex min-h-20 w-full flex-col gap-1">
               {isFetching && offers.length === 0 && (
                  <>
                     <Skeleton className="h-[106px] w-full min-w-10" />
                     <Skeleton className="h-[106px] w-full min-w-10" />
                     <Skeleton className="h-[106px] w-full min-w-10" />
                     <Skeleton className="h-[106px] w-full min-w-10" />
                     <Skeleton className="h-[106px] w-full min-w-10" />
                  </>
               )}
               {offers.map((offer, index) => {
                  const isLast = index === offers.length - 1;
                  return (
                     <Fragment key={offer.id}>
                        <AcceptedOfferListItem
                           offer={offer}
                           useTrackOfferVisibility={useTrackOfferVisibility}
                        />
                        {isLast && <div ref={ref}></div>}
                     </Fragment>
                  );
               })}
            </ul>
            <div
               className="pointer-events-none sticky bottom-0 h-8 w-full bg-gradient-to-t from-background to-transparent"
               aria-hidden="true"
            ></div>
         </ScrollArea>

         {isFetchingNextPage && (
            <p className="animate-pulse py-4 text-center text-sm">{t("pagination.Loading")}</p>
         )}
      </div>
   );
}
