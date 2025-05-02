"use client";

import { useContext } from "react";

import { useStore } from "zustand";

import { useGeolocationData } from "@/hooks/use-geolocation-data";
import { UserStoreContext } from "@/providers/user-store-provider";
import { UserStore } from "@/stores/user-store";

export function useUserStore<T>(selector: (store: UserStore) => T): T {
   const userStoreContext = useContext(UserStoreContext);

   if (!userStoreContext) {
      throw new Error("useUserStore must be used within UserStoreProvider");
   }

   return useStore(userStoreContext, selector);
}

export function useUser() {
   const user = useUserStore((state) => state.user);
   const geolocationData = useGeolocationData();

   if (user) {
      return user;
   }

   return {
      id: null,
      country: geolocationData.country,
      preferredUnitSystem: geolocationData.preferredUnitSystem,
   };
}

export function useSetUser() {
   return useUserStore((state) => state.setUser);
}
