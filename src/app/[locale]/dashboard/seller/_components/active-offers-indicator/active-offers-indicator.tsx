"use client";

import { ComponentProps } from "react";

import { useQuery } from "@tanstack/react-query";

import { SidebarNavIndicator } from "../../../_components/sidebar-nav-indicator";
import { getActiveOffersNotificationCount } from "./actions";
import { sellerActiveOffersNotificationsQueryKey } from "./constants";

type ActiveOffersIndicator = ComponentProps<"div">;

export function ActiveOffersIndicator({ ...props }: ActiveOffersIndicator) {
   const { data: activeOffersNotificationCount } = useQuery({
      queryKey: sellerActiveOffersNotificationsQueryKey,
      queryFn: getActiveOffersNotificationCount,
   });

   if (activeOffersNotificationCount === undefined || activeOffersNotificationCount < 1) {
      return null;
   }
   return (
      <SidebarNavIndicator {...props} number={activeOffersNotificationCount} className="static" />
   );
}
