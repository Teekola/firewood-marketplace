import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// import ws from "ws";
import { env } from "@/env/server";

const prismaClientSingleton = () => {
   if (env.NODE_ENV === "production") {
      return new PrismaClient();
   }
   const connectionString = `${env.POSTGRES_PRISMA_URL}`;
   const pool = new Pool({ connectionString });
   const adapter = new PrismaNeon(pool);
   return new PrismaClient({ adapter });
};

declare const globalThis: {
   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
