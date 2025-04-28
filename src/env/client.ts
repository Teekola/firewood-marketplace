import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
   client: {
      NEXT_PUBLIC_VERCEL_URL: z.string().min(5),
      NEXT_PUBLIC_BASE_URL: z.string().min(5),
   },
   runtimeEnv: {
      NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
   },
});
