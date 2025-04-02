import { UnitSystem } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as z from "zod";

import { createUserAndAcceptTerms, getUserByUsername } from "@/db/user";
import { AuthError } from "@/lib/utils/errors";

import { PASSWORD_PEPPER, credentialsSchema } from "./utils";

export async function registerUserWithEmailAndPassword(data: {
   username: string;
   password: string;
   preferredUnitSystem: UnitSystem;
}) {
   // Validate input
   const parsedData = credentialsSchema
      .extend({ preferredUnitSystem: z.nativeEnum(UnitSystem) })
      .safeParse(data);
   if (!parsedData.success) {
      throw new AuthError({ name: "AUTH_ERROR", message: "Invalid credentials", code: "400" });
   }

   const { username, password, preferredUnitSystem } = parsedData.data;

   // Check if user already exists
   const existingUser = await getUserByUsername(username);
   if (existingUser) {
      throw new AuthError({
         name: "AUTH_ERROR",
         message: "Username is already taken",
         code: "4012",
      });
   }

   // Hash password with salt and pepper
   const salt = await bcrypt.genSalt(12);
   const hashedPassword = await bcrypt.hash(password + PASSWORD_PEPPER, salt);

   // Create user in the database
   const newUser = await createUserAndAcceptTerms({
      username,
      hashedPassword,
      preferredUnitSystem,
   });

   return newUser;
}
