"use client";

import { type ReactNode, createContext, useContext, useEffect, useRef } from "react";

import { useStore } from "zustand";

import { UserDTO } from "@/app/db/user";

import { UserStore, createUserStore } from "./user-store";

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(undefined);

export interface UserStoreProviderProps {
   user: UserDTO | null;
   children: ReactNode;
}

export function UserStoreProvider({ children, user }: UserStoreProviderProps) {
   const storeRef = useRef<UserStoreApi>();
   if (!storeRef.current) {
      storeRef.current = createUserStore({ user });
   }

   return (
      <UserStoreContext.Provider value={storeRef.current}>
         <UserUpdater user={user}>{children}</UserUpdater>
      </UserStoreContext.Provider>
   );
}

export function UserUpdater({ children, user }: UserStoreProviderProps) {
   const setUser = useSetUser();

   useEffect(() => {
      setUser(user);
   }, [user, setUser]);

   return children;
}

export function useUserStore<T>(selector: (store: UserStore) => T): T {
   const userStoreContext = useContext(UserStoreContext);

   if (!userStoreContext) {
      throw new Error("useRequestOffersStore must be used within RequestOffersStoreProvider");
   }

   return useStore(userStoreContext, selector);
}

export function useUser() {
   const user = useUserStore((state) => state.user);
   if (!user) throw Error(`User is ${user}`); // User should always be defined in the context when using useUser
   return user;
}

export function useSetUser() {
   return useUserStore((state) => state.setUser);
}
