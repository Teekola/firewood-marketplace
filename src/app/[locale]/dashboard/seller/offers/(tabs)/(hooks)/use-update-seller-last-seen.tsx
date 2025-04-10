import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "use-debounce";

import { sellerActiveOffersNotificationsQueryKey } from "../../../_components/accepted-offers-indicator/constants";
import { sellerSentOffersNotificationsQueryKey } from "../../../_components/sent-offers-sidebar-nav-indicator/constants";
import { sellerAcceptedOffersQueryKey } from "../accepted/constants";
import { updateSellerLastSeenOffers } from "./actions";

export function useUpdateSellerLastSeen() {
   const [, setSeenOffers] = useState(new Set<string>());
   const queryClient = useQueryClient();

   // Debounced function to update seller last seen at after a delay
   const updateSellerLastSeenDebounced = useDebouncedCallback((offerIds: string[]) => {
      if (offerIds.length < 1) return;
      updateSellerLastSeenOffers(offerIds);
      setSeenOffers(new Set()); // Clear the seen offers set after sending the update
      queryClient.invalidateQueries({ queryKey: sellerSentOffersNotificationsQueryKey });
      queryClient.invalidateQueries({ queryKey: sellerAcceptedOffersQueryKey });
      queryClient.invalidateQueries({ queryKey: sellerActiveOffersNotificationsQueryKey });
   }, 2000); // Update after 2 seconds (can be adjusted)

   // Track visibility of each offer and mark as seen when it's in view
   const useTrackOfferVisibility = (offerId: string) => {
      const { ref, inView } = useInView({
         triggerOnce: true, // Trigger only once when the offer is in view
      });

      useEffect(() => {
         if (inView) {
            // Only add to seenOffers if it's not already seen
            setSeenOffers((prev) => {
               if (prev.has(offerId)) return prev;
               const updatedSeenOffers = new Set(prev);
               updatedSeenOffers.add(offerId);
               // Trigger the debounced update for all seen offers after a delay
               updateSellerLastSeenDebounced([...updatedSeenOffers]);
               return updatedSeenOffers; // Return the updated state
            });
         }
      }, [inView, offerId]);

      return ref;
   };

   return { useTrackOfferVisibility };
}
