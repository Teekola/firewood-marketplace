"use client";

import { type ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";

import { UnitSystem } from "@prisma/client";
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
   const storeRef = useRef<UserStoreApi>(undefined);
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

const defaultUserData: UserDTO = {
   preferredUnitSystem: UnitSystem.METRIC,
   id: "guest",
   name: "guest",
   email: null,
   image: null,
};

// Gets the correct unit system based on geolocation and uses other default values
export function useDefaultUser() {
   const [defaultUser, setDefaultUser] = useState(defaultUserData);

   useEffect(() => {
      (async () => {
         const getPreferredUnitSystem = await fetch(
            "/api/auth/get-unit-system-based-on-geolocation",
            { cache: "no-store" } // this cannot be cached as it needs to read the headers always
         );
         const { preferredUnitSystem } = await getPreferredUnitSystem.json();

         setDefaultUser((prev) => ({ ...prev, preferredUnitSystem }));
      })();
   }, []);
   return defaultUser;
}

export function useUser() {
   const user = useUserStore((state) => state.user);
   const defaultUser = useDefaultUser();

   if (user) {
      return user;
   }

   return defaultUser;
}

export function useSetUser() {
   return useUserStore((state) => state.setUser);
}
