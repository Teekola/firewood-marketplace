"use client";

import { useEffect, useState } from "react";

import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "use-debounce";

import { TViewItemsFn } from "../types";

interface UseViewItemsArgs {
   viewItems?: TViewItemsFn; // NOTE! This function should also handle invalidating queries
}
export function useViewItems({ viewItems }: UseViewItemsArgs) {
   const [, setPendingViewedItems] = useState(new Set<string>());

   const viewItemsDebounced = useDebouncedCallback((ids: string[]) => {
      if (ids.length < 1) return;
      if (viewItems) {
         viewItems(ids);
         console.log("items viewed:", ids.length);
      }
      setPendingViewedItems(new Set()); // Clear the pending viewed tiems set after sending the update
   }, 2000); // Update after 2 seconds

   const useTrackViewing = (id: string) => {
      const { ref, inView } = useInView({ triggerOnce: true });

      useEffect(() => {
         if (!inView || !viewItems) return;

         setPendingViewedItems((prev) => {
            // Only add to pending viewed items if it has not been already seen
            if (prev.has(id)) return prev;

            const updatedPendingViewedItems = new Set(prev);
            updatedPendingViewedItems.add(id);

            // Trigger the debounced update for all viewed items after a delay
            viewItemsDebounced([...updatedPendingViewedItems]);
            return updatedPendingViewedItems;
         });
      }, [inView, id]);

      return ref;
   };

   return { useTrackViewing };
}
