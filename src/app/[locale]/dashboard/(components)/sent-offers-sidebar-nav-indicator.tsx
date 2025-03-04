"use client";

import { ComponentProps } from "react";

import { useQuery } from "@tanstack/react-query";

import { sellerSentOffersNotificationsQueryKey } from "../seller/offers/constants";
import { getUnseenQuotationRequestsCount } from "../seller/quotation-requests/actions";
import { SidebarNavIndicator } from "./sidebar-nav-indicator";

type SentOffersSidebarNavIndicator = ComponentProps<"div">;

export function SentOffersSidebarNavIndicator({ ...props }: SentOffersSidebarNavIndicator) {
   const { data: unseenQuotationRequestsCount } = useQuery({
      queryKey: sellerSentOffersNotificationsQueryKey,
      queryFn: getUnseenQuotationRequestsCount,
   });

   if (unseenQuotationRequestsCount === undefined || unseenQuotationRequestsCount < 1) {
      return null;
   }
   return <SidebarNavIndicator {...props} number={unseenQuotationRequestsCount} />;
}
