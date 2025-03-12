"use client";

import { ComponentProps } from "react";

import { useQuery } from "@tanstack/react-query";

import { getSentOffersNotificationCount } from "../seller/offers/actions";
import { sellerSentOffersNotificationsQueryKey } from "../seller/offers/constants";
import { SidebarNavIndicator } from "./sidebar-nav-indicator";

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
