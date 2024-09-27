import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

import { env } from "@/env/server";

const prismaClientSingleton = () => {
   if (env.NODE_ENV === "production") {
      return new PrismaClient();
   }
   // In development and preview, use the Neon adapter
   neonConfig.webSocketConstructor = ws;
   const connectionString = `${env.POSTGRES_PRISMA_URL}`;
   const pool = new Pool({ connectionString });
   const adapter = new PrismaNeon(pool);
   return new PrismaClient({ adapter });
};

declare const globalThis: {
   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
