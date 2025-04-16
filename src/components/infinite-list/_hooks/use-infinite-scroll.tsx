"use client";

import { useEffect } from "react";

import { useInView } from "react-intersection-observer";

interface UseInfiniteScrollArgs {
   fetchNextPage: () => void;
   hasNextPage?: boolean;
   isFetchingNextPage?: boolean;
}
export function useInfiniteScroll({
   fetchNextPage,
   hasNextPage,
   isFetchingNextPage,
}: UseInfiniteScrollArgs) {
   const { ref, inView } = useInView();
   // Fetch next page when the last item is in view
   useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
         fetchNextPage();
      }
   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

   return { ref };
}
