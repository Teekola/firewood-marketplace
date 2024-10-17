import { createStore } from "zustand/vanilla";

export type RequestOffersStoreState = {
   value: string;
};

export type RequestOffersStoreActions = {
   updateValue: () => void;
};

export type RequestOffersStore = RequestOffersStoreState & RequestOffersStoreActions;

export const defaultInitState: RequestOffersStoreState = {
   value: "default value",
};

export function createRequestOffersStore(initState: RequestOffersStoreState = defaultInitState) {
   return createStore<RequestOffersStore>()((set) => ({
      ...initState,
      updateValue: () => set((state) => ({ value: state.value + 1 })),
   }));
}
