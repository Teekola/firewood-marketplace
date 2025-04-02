"use server";

import {
   getPendingOffersCountForBuyerByQuotationRequestId,
   getPendingOffersForBuyerByQuotationRequestIdPaginated,
   getRejectedOffersCountForBuyerByQuotationRequestId,
   getRejectedOffersForBuyerByQuotationRequestIdPaginated,
} from "@/db/offer";
import { SortOrder } from "@/lib/utils/types";

export async function getPendingOffersForBuyerByQuotationRequestId({
   cursor,
   limit = 10,
   sort = "newest-first",
   id,
}: {
   cursor: string | null;
   limit?: number;
   sort?: SortOrder;
   id: string;
}) {
   const [results, count] = await Promise.all([
      getPendingOffersForBuyerByQuotationRequestIdPaginated({
         id,
         cursor,
         limit,
         sort,
      }),
      getPendingOffersCountForBuyerByQuotationRequestId({ id }),
   ]);

   const hasMore = results.length > limit;
   const offers = hasMore ? results.slice(0, limit) : results;
   const nextCursor = hasMore ? offers[offers.length - 1].id : null;

   return { offers, nextCursor, count };
}

export async function getRejectedOffersForBuyerByQuotationRequestId({
   cursor,
   limit = 10,
   sort = "newest-first",
   id,
}: {
   cursor: string | null;
   limit?: number;
   sort?: SortOrder;
   id: string;
}) {
   const [results, count] = await Promise.all([
      getRejectedOffersForBuyerByQuotationRequestIdPaginated({
         id,
         cursor,
         limit,
         sort,
      }),
      getRejectedOffersCountForBuyerByQuotationRequestId({ id }),
   ]);

   const hasMore = results.length > limit;
   const offers = hasMore ? results.slice(0, limit) : results;
   const nextCursor = hasMore ? offers[offers.length - 1].id : null;

   return { offers, nextCursor, count };
}
