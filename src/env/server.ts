import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
   server: {
      POSTGRES_PRISMA_URL: z.string().url(),
      POSTGRES_URL_NON_POOLING: z.string().url(),
      NODE_ENV: z.enum(["development", "production", "test", "staging", "preview"]),
   },
   experimental__runtimeEnv: process.env,
});
