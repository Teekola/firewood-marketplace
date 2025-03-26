"use client";

import { ComponentProps } from "react";

import { useQuery } from "@tanstack/react-query";

import { SidebarNavIndicator } from "../../(components)/sidebar-nav-indicator";
import { getUnseenQuotationRequestsCount } from "../quotation-requests/actions";
import { sellerUnseenQuotationRequestsQueryKey } from "../quotation-requests/constants";

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
