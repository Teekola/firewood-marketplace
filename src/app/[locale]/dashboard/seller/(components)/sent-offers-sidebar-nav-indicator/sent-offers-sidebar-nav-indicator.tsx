"use client";

import { ComponentProps } from "react";

import { useQuery } from "@tanstack/react-query";

import { SidebarNavIndicator } from "../../../(components)/sidebar-nav-indicator";
import { getSentOffersNotificationCount } from "./actions";
import { sellerSentOffersNotificationsQueryKey } from "./constants";

type SentOffersSidebarNavIndicator = ComponentProps<"div">;

export function SentOffersSidebarNavIndicator({ ...props }: SentOffersSidebarNavIndicator) {
   const { data: sentOffersNotificationCount } = useQuery({
      queryKey: sellerSentOffersNotificationsQueryKey,
      queryFn: getSentOffersNotificationCount,
   });

   if (sentOffersNotificationCount === undefined || sentOffersNotificationCount < 1) {
      return null;
   }
   return <SidebarNavIndicator {...props} number={sentOffersNotificationCount} />;
}
