import { type NextRequest } from "next/server";

import { UnitSystem } from "@prisma/client";
import { geolocation } from "@vercel/functions";

import { imperialSystemCountries } from "../../../../lib/imperial-system-countries";

export async function GET(request: NextRequest) {
   // Get country code from geolocation data and determine unit system
   const { country } = geolocation(request);
   const isImperialCountry = !!country && imperialSystemCountries.has(country);
   const preferredUnitSystem = isImperialCountry ? UnitSystem.IMPERIAL : UnitSystem.METRIC;

   return Response.json({ preferredUnitSystem });
}
