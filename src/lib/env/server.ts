import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    JWT_SECRET_KEY: z.string().min(1),
    NODE_ENV: z.string().min(1).default("production"),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
