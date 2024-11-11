"use client";

import { SessionProvider as SessionProviderNextAuth, SessionProviderProps } from "next-auth/react";

export function SessionProvider({ session, children }: SessionProviderProps) {
   return <SessionProviderNextAuth session={session}>{children}</SessionProviderNextAuth>;
}
