import { type NextRequest } from "next/server";

import { authorizeUserWithEmailAndPassword } from "@/auth/credentials.ts/authorize-with-email-password";
import { env } from "@/env/server";

export async function POST(request: NextRequest) {
   if (request.headers.get("X-Api-Key") !== env.INTERNAL_API_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
   }
   try {
      const user = await authorizeUserWithEmailAndPassword(await request.json());
      return Response.json(user);
   } catch (error) {
      Response.json(
         { error: error instanceof Error ? error.message : "Unknown error" },
         { status: 400 }
      );
   }
}
