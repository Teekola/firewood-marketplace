"use client";

import { QuotationRequestStatus } from "@prisma/client";

import { InfiniteList } from "@/components/infinite-list";
import { Skeleton } from "@/components/ui/skeleton";
import { BuyerQuotationRequest } from "@/db/quotation-request";

import { getBuyerQuotationRequestInfiniteQueryOptions } from "./query-options";
import { QuotationRequestListItem } from "./quotation-request-list-item";

export function QuotationRequestList({
   status,
   emptyStateComponent,
}: Readonly<{ status: QuotationRequestStatus; emptyStateComponent?: React.ReactNode }>) {
   return (
      <InfiniteList<BuyerQuotationRequest>
         getQueryOptions={({ limit, sortOrder }) =>
            getBuyerQuotationRequestInfiniteQueryOptions({ status, limit, sortOrder })
         }
         ListItemComponent={QuotationRequestListItem}
         emptyStateComponent={emptyStateComponent}
         loadingStateComponent={
            <div className="flex flex-col gap-1">
               {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-[106.5px] w-full" />
               ))}
            </div>
         }
      />
   );
}
