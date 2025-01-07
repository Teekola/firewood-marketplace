import { type NextRequest } from "next/server";

import { UnitSystem } from "@prisma/client";
import { geolocation } from "@vercel/functions";

import { prisma } from "@/prisma";
import { prismaEdge } from "@/prismaEdge";

import { imperialSystemCountries } from "../../../../lib/imperial-system-countries";

export async function GET(request: NextRequest) {
   const id = request.nextUrl.searchParams.get("id");

   if (!id) {
      return new Response("Bad request. Id is missing in query", { status: 400 });
   }

   const userData = await prismaEdge.user.findUnique({
      select: { preferredUnitSystem: true },
      where: { id },
   });

   const isUserPreferredUnitSystem = !!userData?.preferredUnitSystem;

   if (isUserPreferredUnitSystem) {
      return Response.json({ preferredUnitSystem: userData.preferredUnitSystem });
   }

   // Get country code from geolocation data and determine unit system
   const { country } = geolocation(request);
   const isImperialCountry = !!country && imperialSystemCountries.has(country);
   const preferredUnitSystem = isImperialCountry ? UnitSystem.IMPERIAL : UnitSystem.METRIC;

   const updatedUser = await prisma.user.update({
      data: {
         preferredUnitSystem,
      },
      where: {
         id,
      },
      select: {
         preferredUnitSystem: true,
      },
   });

   return Response.json({ preferredUnitSystem: updatedUser.preferredUnitSystem });
}
