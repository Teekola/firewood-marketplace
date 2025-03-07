import bcrypt from "bcryptjs";

import { getUserByUsername } from "@/app/db/user";

import { PASSWORD_PEPPER, credentialsSchema } from "./utils";

export async function authorizeUserWithEmailAndPassword(credentials: unknown) {
   // Validate input
   const parsedCredentials = credentialsSchema.safeParse(credentials);
   if (!parsedCredentials.success) {
      throw new Error(parsedCredentials.error.errors.map((e) => e.message).join(", "));
   }

   const { username, password } = parsedCredentials.data;

   // Find user by username
   // NOTE: THIS NEEDS TO BE FROM AN API ROUTE, CANNOT USE PRISMA DIRECTLY
   const user = await getUserByUsername(username);

   if (!user || !user.password) {
      throw new Error("Invalid username or password");
   }

   // Compare hashed password with the provided password (including pepper)
   const isValid = await bcrypt.compare(password + PASSWORD_PEPPER, user.password);
   if (!isValid) {
      throw new Error("Invalid username or password");
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
