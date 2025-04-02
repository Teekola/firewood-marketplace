"use server";

import { QuotationRequestStatus } from "@prisma/client";

import { authWithBuyer } from "@/auth/auth";
import {
   getQuotationRequestsByBuyerIdAndStatusPaginated,
   getQuotationRequestsCountByBuyerIdAndStatus,
} from "@/db/quotation-request";
import { SortOrder } from "@/lib/utils/types";

export async function getQuotationRequestsForBuyer({
   cursor,
   limit = 10,
   sort = "newest-first",
   status,
}: {
   cursor: string | null;
   limit?: number;
   sort?: SortOrder;
   status: QuotationRequestStatus;
}) {
   const session = await authWithBuyer();
   if (!session || !session.buyer) {
      return { requests: [], nextCursor: null, count: 0 };
   }

   const [results, count] = await Promise.all([
      getQuotationRequestsByBuyerIdAndStatusPaginated({
         buyerId: session.buyer.id,
         cursor,
         limit,
         sort,
         status,
      }),
      getQuotationRequestsCountByBuyerIdAndStatus({ buyerId: session.buyer.id, status }),
   ]);

   const hasMore = results.length > limit;
   const requests = hasMore ? results.slice(0, limit) : results;
   const nextCursor = hasMore ? requests[requests.length - 1].id : null;

   return { requests, nextCursor, count };
}
