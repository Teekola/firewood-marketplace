import "server-only";

import { env as clientEnv } from "@/env/client";
import { env } from "@/env/server";

const http = env.NODE_ENV === "development" ? "http" : "https";
export const baseUrl = `${http}://${clientEnv.NEXT_PUBLIC_VERCEL_URL}`;
