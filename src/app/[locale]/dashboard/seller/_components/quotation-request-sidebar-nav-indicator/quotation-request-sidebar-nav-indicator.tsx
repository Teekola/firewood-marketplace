"use client";

import { ComponentProps } from "react";

import { useQuery } from "@tanstack/react-query";

import { SidebarNavIndicator } from "../../../_components/sidebar-nav-indicator";
import { getUnseenQuotationRequestsCount } from "./actions";
import { sellerUnseenQuotationRequestsQueryKey } from "./constants";

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
