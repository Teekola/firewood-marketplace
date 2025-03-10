import bcrypt from "bcryptjs";

import { getUserByUsername } from "@/app/db/user";
import { AuthError } from "@/lib/utils/errors";

import { PASSWORD_PEPPER, credentialsSchema } from "./utils";

export async function authorizeUserWithEmailAndPassword(credentials: unknown) {
   // Validate input
   const parsedCredentials = credentialsSchema.safeParse(credentials);
   if (!parsedCredentials.success) {
      throw new AuthError({ name: "AUTH_ERROR", message: "Invalid credentials", code: "400" });
   }

   const { username, password } = parsedCredentials.data;

   // Find user by username
   // NOTE: THIS NEEDS TO BE FROM AN API ROUTE, CANNOT USE PRISMA DIRECTLY
   const user = await getUserByUsername(username);

   if (!user) {
      throw new AuthError({
         name: "AUTH_ERROR",
         message: "Invalid username or password",
         code: "4010",
      });
   }

   if (!user.password) {
      throw new AuthError({
         name: "AUTH_ERROR",
         message: "Your account uses a different login method",
         code: "4011",
      });
   }

   // Compare hashed password with the provided password (including pepper)
   const isValid = await bcrypt.compare(password + PASSWORD_PEPPER, user.password);
   if (!isValid) {
      throw new AuthError({
         name: "AUTH_ERROR",
         message: "Invalid username or password",
         code: "4010",
      });
   }

   // Return user session data
   return {
      id: user.id,
      name: user.name,
      email: user.email,
      preferredUnitSystem: user.preferredUnitSystem || "METRIC",
      isRegistered: user.isRegistered,
   };
}
