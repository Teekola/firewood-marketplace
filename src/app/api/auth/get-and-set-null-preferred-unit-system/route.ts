import { type NextRequest } from "next/server";

import { UnitSystem } from "@prisma/client";
import { geolocation } from "@vercel/functions";

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

   const { country } = geolocation(request);
   const isImperial = imperialSystemCountries.has(country ?? "");

   const preferredUnitSystem =
      userData?.preferredUnitSystem ?? (isImperial ? UnitSystem.IMPERIAL : UnitSystem.METRIC);

   return Response.json({ preferredUnitSystem });
}
