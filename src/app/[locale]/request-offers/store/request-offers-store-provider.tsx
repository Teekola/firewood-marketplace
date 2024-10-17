"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";

import { useStore } from "zustand";

import { type RequestOffersStore, createRequestOffersStore } from "./request-offers-store";

export type RequestOffersStoreApi = ReturnType<typeof createRequestOffersStore>;

export const RequestOffersStoreContext = createContext<RequestOffersStoreApi | undefined>(
   undefined
);

export interface RequestOffersStoreProviderProps {
   children: ReactNode;
}

export function RequestOffersStoreProvider({ children }: RequestOffersStoreProviderProps) {
   const storeRef = useRef<RequestOffersStoreApi>();
   if (!storeRef.current) {
      storeRef.current = createRequestOffersStore();
   }

   return (
      <RequestOffersStoreContext.Provider value={storeRef.current}>
         {children}
      </RequestOffersStoreContext.Provider>
   );
}

export function useRequestOffersStore<T>(selector: (store: RequestOffersStore) => T): T {
   const requestOffersStoreContext = useContext(RequestOffersStoreContext);

   if (!requestOffersStoreContext) {
      throw new Error("useRequestOffersStore must be used within RequestOffersStoreProvider");
   }

   return useStore(requestOffersStoreContext, selector);
}

export function useRequestOffers() {
   return useRequestOffersStore((state) => state);
}

export function useValue() {
   return useRequestOffersStore((state) => state.value);
}
