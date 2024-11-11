"use client";

import { useSession } from "next-auth/react";

export function useUser() {
   const session = useSession();

   const user = session?.data?.user;
   return user;
}
