"use client";

import { PropsWithChildren, createContext, useEffect, useRef } from "react";

import { UserDTO } from "@/db/user";
import { useSetUser } from "@/hooks/user-store";

import { createUserStore } from "../stores/user-store";

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(undefined);

export interface UserStoreProviderProps {
   user: UserDTO | null;
}

export function UserStoreProvider({
   children,
   user,
}: Readonly<PropsWithChildren<UserStoreProviderProps>>) {
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

function UserUpdater({ children, user }: Readonly<PropsWithChildren<UserStoreProviderProps>>) {
   const setUser = useSetUser();

   useEffect(() => {
      setUser(user);
   }, [user, setUser]);

   return children;
}
