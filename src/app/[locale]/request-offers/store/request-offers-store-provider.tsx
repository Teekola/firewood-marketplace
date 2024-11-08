"use client";

import { type ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";

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

export function useSubmitData() {
   return useRequestOffersStore((state) => state.submitData);
}

export function useSetSubmitData() {
   return useRequestOffersStore((state) => state.setSubmitData);
}

export function useLastUnlockedStep() {
   const firewoodData = useFirewoodData();
   const deliveryData = useDeliveryData();
   const contactData = useContactData();
   const isHydrated = useIsHydrated();

   const [lastUnlockedStep, setLastUnlockedStep] = useState<number>();

   useEffect(() => {
      if (!isHydrated) return;
      if (contactFormSchema.safeParse(contactData).success) {
         setLastUnlockedStep(4);
         return;
      }
      if (deliveryFormSchema.safeParse(deliveryData).success) {
         setLastUnlockedStep(3);
         return;
      }
      if (firewoodFormSchema.safeParse(firewoodData).success) {
         setLastUnlockedStep(2);
         return;
      }
      setLastUnlockedStep(1);
   }, [isHydrated, firewoodData, deliveryData, contactData]);

   return lastUnlockedStep;
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
