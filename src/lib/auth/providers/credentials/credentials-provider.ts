import { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { env } from "@/env/server";
import { errorSchema } from "@/lib/utils/errors";

import { baseUrl } from "../../constants";

export const credentialsProvider = Credentials({
   id: "email-password",
   credentials: {
      username: { type: "text" },
      password: { type: "password" },
   },
   async authorize(credentials) {
      // NOTE: CANNOT USE PRISMA DIRECTLY
      const response = await fetch(`${baseUrl}/api/auth/authorize-user-with-email-and-password`, {
         method: "POST",
         body: JSON.stringify(credentials),
         headers: {
            "X-Api-Key": env.INTERNAL_API_SECRET,
         },
      });
      const result = await response.json();

      // Parse the result with error schema. If it has message key, it is considered a success.
      // By throwing CredentialsSignin error with customized code, we can display error in the client.
      const parsedResult = errorSchema.safeParse(result);
      if (parsedResult.success) {
         const error = new CredentialsSignin();
         error.code = parsedResult.data.message;
         throw error;
      }

      return result;
   },
});
