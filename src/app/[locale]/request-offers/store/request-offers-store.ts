import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { DeliveryData } from "../delivery/delivery-form";
import { FirewoodData } from "../firewood/firewood-form";

export type RequestOffersStoreState = {
   firewoodData?: FirewoodData;
   deliveryData?: DeliveryData;
};

export type RequestOffersStoreActions = {
   setFirewoodData: (firewoodData: FirewoodData) => void;
   setDeliveryData: (deliveryData: DeliveryData) => void;
};

export type RequestOffersStore = RequestOffersStoreState & RequestOffersStoreActions;

export const defaultInitState: RequestOffersStoreState = {};

export function createRequestOffersStore(initState: RequestOffersStoreState = defaultInitState) {
   return createStore(
      persist<RequestOffersStore>(
         (set) => ({
            ...initState,
            setFirewoodData: (firewoodData) => set((state) => ({ ...state, firewoodData })),
            setDeliveryData: (deliveryData) => set((state) => ({ ...state, deliveryData })),
         }),
         {
            name: "requestOffersStore",
            storage: createJSONStorage<RequestOffersStore>(() => sessionStorage),
         }
      )
   );
}
