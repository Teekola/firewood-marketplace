import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { ContactData } from "../contact/contact-form";
import { DeliveryData } from "../delivery/delivery-form";
import { FirewoodData } from "../firewood/firewood-form";

export type RequestOffersStoreState = {
   firewoodData?: Partial<FirewoodData>;
   deliveryData?: DeliveryData;
   contactData?: ContactData;
   isHydrated?: boolean;
};

export type RequestOffersStoreActions = {
   setFirewoodData: (firewoodData: Partial<FirewoodData>) => void;
   setDeliveryData: (deliveryData: DeliveryData) => void;
   setContactData: (contactData: ContactData) => void;
   clear: () => void;
   setHydrated: () => void;
};

export type RequestOffersStore = RequestOffersStoreState & RequestOffersStoreActions;

export const defaultInitState: RequestOffersStoreState = {};

const STORAGE_NAME = "requestOffersStore";
export function createRequestOffersStore(initState: RequestOffersStoreState = defaultInitState) {
   return createStore(
      persist<RequestOffersStore>(
         (set) => ({
            ...initState,
            setFirewoodData: (firewoodData) => {
               console.log("SET");
               set((state) => ({ ...state, firewoodData }));
            },
            setDeliveryData: (deliveryData) => set((state) => ({ ...state, deliveryData })),
            setContactData: (contactData) => set((state) => ({ ...state, contactData })),
            clear: () => {
               set(() => defaultInitState);
               sessionStorage.removeItem(STORAGE_NAME);
            },
            setHydrated: () => set((state) => ({ ...state, isHydrated: true })),
         }),
         {
            name: STORAGE_NAME,
            storage: createJSONStorage<RequestOffersStore>(() => sessionStorage),
            onRehydrateStorage: () => {
               console.log("Hydrating...");

               return (state, error) => {
                  if (error) {
                     console.error("An error occurred during hydration");
                     return;
                  }
                  if (state) {
                     console.log("Hydration finished");
                     state.setHydrated();
                  }
               };
            },
         }
      )
   );
}
