import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

import { env } from "@/env/server";

const connectionString = env.POSTGRES_PRISMA_URL;

const prismaClientEdgeSingleton = () => {
   const pool = new Pool({ connectionString });
   const adapter = new PrismaNeon(pool);
   return new PrismaClient({ adapter });
};

declare const globalThis: {
   prismaEdge: ReturnType<typeof prismaClientEdgeSingleton>;
} & typeof global;

export const prismaEdge = globalThis.prismaEdge ?? prismaClientEdgeSingleton();

if (env.NODE_ENV !== "production") globalThis.prismaEdge = prismaEdge;
