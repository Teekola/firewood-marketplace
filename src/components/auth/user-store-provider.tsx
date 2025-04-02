"use client";

import { type ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";

import { UnitSystem } from "@prisma/client";
import { useStore } from "zustand";

import { UserDTO } from "@/db/user";

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

const defaultGeolocationData = {
   preferredUnitSystem: UnitSystem.METRIC,
   country: "FI",
};

// Gets the correct unit system based on geolocation and uses other default values
// Caches the data in local storage
export function useGeolocationData() {
   const [geolocationData, setGeolocationData] = useState(defaultGeolocationData);

   useEffect(() => {
      const storedData = localStorage.getItem("geolocationData");
      if (storedData) {
         setGeolocationData(JSON.parse(storedData));
         return;
      }
      (async () => {
         const getPreferredUnitSystem = await fetch(
            "/api/auth/get-geolocation-data",
            { cache: "no-store" } // this cannot be cached as it needs to read the headers always
         );
         const { preferredUnitSystem, country } = await getPreferredUnitSystem.json();

         setGeolocationData((prev) => {
            const newData = { ...prev, preferredUnitSystem, country };
            localStorage.setItem("geolocationData", JSON.stringify(newData)); // Cache for future use
            return newData;
         });
      })();
   }, []);
   return geolocationData;
}

export function useUser() {
   const user = useUserStore((state) => state.user);
   const geolocationData = useGeolocationData();

   if (user) {
      return user;
   }

   return {
      country: geolocationData.country,
      preferredUnitSystem: geolocationData.preferredUnitSystem,
   };
}

export function useSetUser() {
   return useUserStore((state) => state.setUser);
}
