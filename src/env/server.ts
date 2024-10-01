import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
   server: {
      AUTH_SECRET: z.string().min(1),
      AUTH_GOOGLE_ID: z.string().min(1),
      AUTH_GOOGLE_SECRET: z.string().min(1),
      POSTGRES_PRISMA_URL: z.string().url(),
      POSTGRES_URL_NON_POOLING: z.string().url(),
      ENV: z.enum(["development", "production", "test", "staging", "preview"]),
      NODE_ENV: z.enum(["development", "production", "test", "staging", "preview"]),
   },
   experimental__runtimeEnv: process.env,
});
