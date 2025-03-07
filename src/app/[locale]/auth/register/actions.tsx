"use server";

import { env as clientEnv } from "@/env/client";
import { env } from "@/env/server";

const http = env.NODE_ENV === "development" ? "http" : "https";
const baseUrl = `${http}://${clientEnv.NEXT_PUBLIC_VERCEL_URL}/api/auth`;

export async function registerWithEmailAndPassword({
   username,
   password,
}: {
   username: string;
   password: string;
}) {
   const result = await fetch(`${baseUrl}/register-user-with-email-and-password`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json", "X-Api-Key": env.INTERNAL_API_SECRET },
   });
   return await result.json();
}
