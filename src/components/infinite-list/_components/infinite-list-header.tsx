"use client";

import { Dispatch, SetStateAction } from "react";

import { useTranslations } from "next-intl";

import { SortButton } from "@/app/[locale]/dashboard/buyer/quotation-requests/id/[id]/_components/offer-list/sort-button";
import { SortOrder } from "@/lib/utils/types";

interface InfiniteListHeaderProps {
   totalCount: number;
   displayedCount: number;
   isFetching?: boolean;
   sortOrder: SortOrder;
   setSortOrder: Dispatch<SetStateAction<SortOrder>>;
}
export function InfiniteListHeader({
   totalCount,
   displayedCount,
   isFetching,
   sortOrder,
   setSortOrder,
}: InfiniteListHeaderProps) {
   const t = useTranslations();
   return (
      <div className="flex items-center gap-2">
         {totalCount === 0 && !isFetching && (
            <p className="text-sm text-foreground-muted">{t("offer.There are no active offers")}</p>
         )}
         {totalCount > 0 && (
            <p className="text-sm text-foreground-muted">
               {t("pagination.displayed-results", { displayed: displayedCount, total: totalCount })}
            </p>
         )}
         {isFetching && (
            <p className="animate-pulse text-center text-sm text-foreground-muted">
               {t("pagination.Loading")}
            </p>
         )}
         <SortButton sortOrder={sortOrder} setSortOrder={setSortOrder} />
      </div>
   );
}
