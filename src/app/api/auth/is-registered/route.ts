import { type NextRequest } from "next/server";

import { prismaEdge } from "@/prismaEdge";

export async function GET(request: NextRequest) {
   const id = request.nextUrl.searchParams.get("id");

   if (!id) {
      return new Response("Bad request. Id is missing in query", { status: 400 });
   }

   const userData = await prismaEdge.user.findUnique({
      select: { isRegistered: true },
      where: { id },
   });

   return Response.json({ isRegistered: userData?.isRegistered ?? false });
}
