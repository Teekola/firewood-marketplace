import { type NextRequest } from "next/server";

import { UnitSystem } from "@prisma/client";
import { geolocation } from "@vercel/functions";

import { imperialSystemCountries } from "../../../../i18n/constants/imperial-system-countries";

export async function GET(request: NextRequest) {
   // Get country code from geolocation data and determine unit system
   const { country } = geolocation(request);
   const isImperialCountry = !!country && imperialSystemCountries.has(country);
   const preferredUnitSystem = isImperialCountry ? UnitSystem.IMPERIAL : UnitSystem.METRIC;

   return new Response(JSON.stringify({ preferredUnitSystem, country: country ?? "Finland" }), {
      status: 200,
      headers: {
         "Content-Type": "application/json",
         "Cache-Control": "public, max-age=300", // cache for 5 minutes
      },
   });
}
