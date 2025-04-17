"use client";

import { useTranslations } from "next-intl";

import { InfiniteList } from "@/components/infinite-list";
import { Skeleton } from "@/components/ui/skeleton";

import {
   SellerQuotationRequest,
   getRejectedQuotationRequestsInfiniteQueryOptions,
} from "./query-options";
import { RejectedQuotationRequestListItem } from "./rejected-quotation-request-list-item";

async function viewItems(ids: string[]) {
   console.log("Viewed", ids);
}

export function RejectedQuotationRequestList() {
   const t = useTranslations();
   return (
      <InfiniteList<SellerQuotationRequest>
         getQueryOptions={getRejectedQuotationRequestsInfiniteQueryOptions}
         ListItemComponent={RejectedQuotationRequestListItem}
         viewItems={viewItems}
         emptyStateComponent={
            <p className="text-sm text-foreground-muted">
               {t("quotation-request.There are no rejected quotation requests")}
            </p>
         }
         loadingStateComponent={
            <div className="flex flex-col gap-2">
               {Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton key={index} className="h-[106.5px] w-full" />
               ))}
            </div>
         }
      />
   );
}
