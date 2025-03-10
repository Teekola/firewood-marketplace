import { type NextRequest } from "next/server";

import { authorizeUserWithEmailAndPassword } from "@/auth/credentials.ts/authorize-with-email-and-password";
import { env } from "@/env/server";
import { AuthError } from "@/lib/utils/errors";

export async function POST(request: NextRequest) {
   if (request.headers.get("X-Api-Key") !== env.INTERNAL_API_SECRET) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
   }
   try {
      const user = await authorizeUserWithEmailAndPassword(await request.json());
      return Response.json(user);
   } catch (error) {
      if (error instanceof AuthError) {
         return Response.json({ message: error.message }, { status: 401 });
      }
      return Response.json({ message: "An error occurred" }, { status: 400 });
   }
}
