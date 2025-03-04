"use client";

import { ComponentProps } from "react";

import { useQuery } from "@tanstack/react-query";

import { getUnseenQuotationRequestsCount } from "../seller/quotation-requests/actions";
import { sellerUnseenQuotationRequestsQueryKey } from "../seller/quotation-requests/constants";
import { SidebarNavIndicator } from "./sidebar-nav-indicator";

type QuotationRequestSidebarNavIndicatorProps = ComponentProps<"div">;

export function QuotationRequestSidebarNavIndicator({
   ...props
}: QuotationRequestSidebarNavIndicatorProps) {
   const { data: unseenQuotationRequestsCount } = useQuery({
      queryKey: sellerUnseenQuotationRequestsQueryKey,
      queryFn: getUnseenQuotationRequestsCount,
   });

   if (unseenQuotationRequestsCount === undefined || unseenQuotationRequestsCount < 1) {
      return null;
   }
   return <SidebarNavIndicator {...props} number={unseenQuotationRequestsCount} />;
}
