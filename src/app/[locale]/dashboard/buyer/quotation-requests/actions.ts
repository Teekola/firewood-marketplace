"use server";

import {
   getPendingQuotationRequestsByBuyerIdPaginated,
   getPendingQuotationRequestsCountByBuyerId,
} from "@/app/db/quotation-request";
import { authWithBuyer } from "@/auth/auth";
import { SortOrder } from "@/lib/utils/types";

export async function getPendingQuotationRequestsForBuyer({
   cursor,
   limit = 10,
   sort = "newest-first",
}: {
   cursor: string | null;
   limit?: number;
   sort?: SortOrder;
}) {
   const session = await authWithBuyer();
   if (!session || !session.buyer) {
      return { requests: [], nextCursor: null, count: 0 };
   }

   const [results, count] = await Promise.all([
      getPendingQuotationRequestsByBuyerIdPaginated({
         buyerId: session.buyer.id,
         cursor,
         limit,
         sort,
      }),
      getPendingQuotationRequestsCountByBuyerId({ buyerId: session.buyer.id }),
   ]);

   const hasMore = results.length > limit;
   const requests = hasMore ? results.slice(0, limit) : results;
   const nextCursor = hasMore ? requests[requests.length - 1].id : null;

   return { requests, nextCursor, count };
}
