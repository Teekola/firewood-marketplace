"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";

import { useStore } from "zustand";

import { contactFormSchema } from "../contact/contact-form";
import { deliveryFormSchema } from "../delivery/delivery-form";
import { firewoodFormSchema } from "../firewood/firewood-form";
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

export function useFirewoodData() {
   return useRequestOffersStore((state) => state.firewoodData);
}

export function useSetFirewoodData() {
   return useRequestOffersStore((state) => state.setFirewoodData);
}
export function useDeliveryData() {
   return useRequestOffersStore((state) => state.deliveryData);
}

export function useSetDeliveryData() {
   return useRequestOffersStore((state) => state.setDeliveryData);
}

export function useContactData() {
   return useRequestOffersStore((state) => state.contactData);
}

export function useSetContactData() {
   return useRequestOffersStore((state) => state.setContactData);
}

export function useLastUnlockedStep() {
   const firewoodData = useFirewoodData();
   const deliveryData = useDeliveryData();
   const contactData = useContactData();

   if (contactFormSchema.safeParse(contactData).success) return 4;
   if (deliveryFormSchema.safeParse(deliveryData).success) return 3;
   if (firewoodFormSchema.safeParse(firewoodData).success) return 2;
   return 1;
}

export function useClearRequestOffersStore() {
   return useRequestOffersStore((state) => state.clear);
}

export function useIsHydrated() {
   return useRequestOffersStore((state) => state.isHydrated);
}

export function useIsStepVerified() {
   return useRequestOffersStore((state) => state.isStepVerified);
}

export function useSetStepVerified() {
   return useRequestOffersStore((state) => state.setStepVerified);
}
