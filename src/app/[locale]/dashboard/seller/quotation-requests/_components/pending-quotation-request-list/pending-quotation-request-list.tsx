"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { InfiniteList } from "@/components/infinite-list";
import { Skeleton } from "@/components/ui/skeleton";

import { sellerUnseenQuotationRequestsQueryKey } from "../../../_components/quotation-request-sidebar-nav-indicator/constants";
import { viewSellerQuotationRequestsAction } from "./actions";
import { PendingQuotationRequestListItem } from "./pending-quotation-request-list-item";
import {
   SellerQuotationRequest,
   getQuotationRequestsInfiniteQueryOptions,
   sellerQuotationRequestsQueryKey,
} from "./query-options";

export function PendingQuotationRequestList() {
   const queryClient = useQueryClient();
   const t = useTranslations();

   async function viewItems(ids: string[]) {
      await viewSellerQuotationRequestsAction(ids);
      queryClient.invalidateQueries({ queryKey: sellerQuotationRequestsQueryKey });
      queryClient.invalidateQueries({ queryKey: sellerUnseenQuotationRequestsQueryKey });
   }

   return (
      <InfiniteList<SellerQuotationRequest>
         getQueryOptions={getQuotationRequestsInfiniteQueryOptions}
         ListItemComponent={PendingQuotationRequestListItem}
         viewItems={viewItems}
         emptyStateComponent={
            <p className="text-sm text-foreground-muted">
               {t("quotation-request.There are no pending quotation requests")}
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
