import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { ContactData } from "../contact/contact-form";
import { DeliveryData } from "../delivery/delivery-form";
import { FirewoodData } from "../firewood/firewood-form";

export type RequestOffersStoreState = {
   firewoodData?: Partial<FirewoodData>;
   deliveryData?: Partial<DeliveryData>;
   contactData?: Partial<ContactData>;
   isHydrated?: boolean;
   isStepVerified?: boolean;
};

export type RequestOffersStoreActions = {
   setFirewoodData: (firewoodData: Partial<FirewoodData>) => void;
   setDeliveryData: (deliveryData: Partial<DeliveryData>) => void;
   setContactData: (contactData: Partial<ContactData>) => void;
   clear: () => void;
   setHydrated: () => void;
   setStepVerified: (b: boolean) => void;
};

export type RequestOffersStore = RequestOffersStoreState & RequestOffersStoreActions;

export const defaultInitState: RequestOffersStoreState = {};

const STORAGE_NAME = "requestOffersStore";
export function createRequestOffersStore(initState: RequestOffersStoreState = defaultInitState) {
   return createStore(
      persist<RequestOffersStore>(
         (set) => ({
            ...initState,
            setFirewoodData: (firewoodData) => set((state) => ({ ...state, firewoodData })),
            setDeliveryData: (deliveryData) => set((state) => ({ ...state, deliveryData })),
            setContactData: (contactData) => set((state) => ({ ...state, contactData })),
            clear: () => {
               set(() => defaultInitState);
               sessionStorage.removeItem(STORAGE_NAME);
            },
            setHydrated: () => set((state) => ({ ...state, isHydrated: true })),
            setStepVerified: (b) => set((state) => ({ ...state, isStepVerified: b })),
         }),
         {
            name: STORAGE_NAME,
            storage: createJSONStorage<RequestOffersStore>(() => sessionStorage),
            partialize: (state: RequestOffersStoreState) =>
               ({
                  firewoodData: state.firewoodData,
                  deliveryData: state.deliveryData,
                  contactData: state.contactData,
               }) as RequestOffersStore, // This cast is needed to get rid of Typescript error, does not affect functionality
            onRehydrateStorage: () => {
               return (state, error) => {
                  if (error) {
                     console.error("An error occurred during hydration");
                     return;
                  }
                  if (state) {
                     state.setHydrated();
                  }
               };
            },
         }
      )
   );
}
