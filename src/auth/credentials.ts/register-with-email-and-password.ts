import { UnitSystem } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as z from "zod";

import { createUserAndAcceptTerms, getUserByUsername } from "@/app/db/user";

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
      throw new Error(parsedData.error.errors.map((e) => e.message).join(", "));
   }

   const { username, password } = parsedData.data;

   // Check if user already exists
   const existingUser = await getUserByUsername(username);
   if (existingUser) {
      throw new Error("Username is already taken");
   }

   // Hash password with salt and pepper
   const salt = await bcrypt.genSalt(12);
   const hashedPassword = await bcrypt.hash(password + PASSWORD_PEPPER, salt);

   // Create user in the database
   const newUser = await createUserAndAcceptTerms({
      username,
      hashedPassword,
   });

   return newUser;
}
