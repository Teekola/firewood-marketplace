import { createStore } from "zustand/vanilla";

import { UserDTO } from "@/app/db/user";

export type UserStoreState = {
   user?: UserDTO | null;
};

export type UserStoreActions = {
   setUser: (user: UserDTO | null) => void;
};

export type UserStore = UserStoreState & UserStoreActions;

export const defaultInitState: UserStoreState = {};

export function createUserStore(initState: UserStoreState = defaultInitState) {
   return createStore<UserStore>((set) => ({
      ...initState,
      setUser: (user) => set((state) => ({ ...state, user })),
   }));
}
