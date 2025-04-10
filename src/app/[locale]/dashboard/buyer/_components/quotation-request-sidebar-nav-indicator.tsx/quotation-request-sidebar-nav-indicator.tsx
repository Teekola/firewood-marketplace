"use client";

import { ComponentProps } from "react";

import { useQuery } from "@tanstack/react-query";

import { SidebarNavIndicator } from "../../../_components/sidebar-nav-indicator";
import { buyerUnseenOffersQueryKey } from "../../constants";
import { getUnseenOffersCount } from "./actions";

type QuotationRequestSidebarNavIndicatorProps = ComponentProps<"div">;

export function QuotationRequestSidebarNavIndicator({
   ...props
}: QuotationRequestSidebarNavIndicatorProps) {
   const { data: unseenOffersCount } = useQuery({
      queryKey: buyerUnseenOffersQueryKey,
      queryFn: getUnseenOffersCount,
   });

   if (unseenOffersCount === undefined || unseenOffersCount < 1) {
      return null;
   }
   return <SidebarNavIndicator {...props} number={unseenOffersCount} />;
}
