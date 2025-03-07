import { type NextRequest } from "next/server";

import { UnitSystem } from "@prisma/client";
import { geolocation } from "@vercel/functions";

import { registerUserWithEmailAndPassword } from "@/auth/credentials.ts/register-with-email-and-password";
import { env } from "@/env/server";
import { imperialSystemCountries } from "@/i18n/imperial-system-countries";

export async function POST(req: NextRequest) {
   if (req.headers.get("X-Api-Key") !== env.INTERNAL_API_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
   }
   try {
      const request = await req.json();

      // Get country code from geolocation data and determine unit system
      let country: string | undefined;
      try {
         const { country: geoCountry } = geolocation(request);
         country = geoCountry;
      } catch {
         console.log("failed to utilize geolocation");
      }

      const isImperialCountry = !!country && imperialSystemCountries.has(country);
      const preferredUnitSystem = isImperialCountry ? UnitSystem.IMPERIAL : UnitSystem.METRIC;

      const newUser = await registerUserWithEmailAndPassword({ ...request, preferredUnitSystem });
      return Response.json(newUser, { status: 201 });
   } catch (error) {
      console.log(error);
      return Response.json(
         { error: error instanceof Error ? error.message : "Unknown error" },
         { status: 400 }
      );
   }
}
