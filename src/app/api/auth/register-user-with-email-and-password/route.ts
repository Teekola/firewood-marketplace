import { type NextRequest } from "next/server";

import { env } from "@/env/server";
import { registerUserWithEmailAndPassword } from "@/lib/auth/providers/credentials/register-with-email-and-password";

export async function POST(req: NextRequest) {
   if (req.headers.get("X-Api-Key") !== env.INTERNAL_API_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
   }
   try {
      const request = await req.json();

      const newUser = await registerUserWithEmailAndPassword({ ...request });
      return Response.json(newUser, { status: 201 });
   } catch (error) {
      console.error(error);
      return Response.json(
         { error: error instanceof Error ? error.message : "Unknown error" },
         { status: 400 }
      );
   }
}
