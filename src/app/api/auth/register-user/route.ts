import { type NextRequest } from "next/server";

import { UnitSystem } from "@prisma/client";
import { geolocation } from "@vercel/functions";

import { prisma } from "@/prisma";

import { imperialSystemCountries } from "../../../../i18n/imperial-system-countries";

export async function GET(request: NextRequest) {
   const id = request.nextUrl.searchParams.get("id");

   if (!id) {
      return new Response("Bad request. Id is missing in query", { status: 400 });
   }

   // Get country code from geolocation data and determine unit system
   const { country } = geolocation(request);
   const isImperialCountry = !!country && imperialSystemCountries.has(country);
   const preferredUnitSystem = isImperialCountry ? UnitSystem.IMPERIAL : UnitSystem.METRIC;

   const updatedUser = await prisma.user.update({
      data: {
         preferredUnitSystem,
         buyer: {
            create: {},
         },
      },
      where: {
         id,
      },
      select: { id: true },
   });

   return Response.json({ id: updatedUser.id });
}
