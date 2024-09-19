import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    ANALYZE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
      
    // Add MongoDB URI validation here
    MONGODB_URI: z.string().url(),
  },
  client: {},
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,

    // Add MongoDB URI here as well
    MONGODB_URI: process.env.MONGODB_URI,
  },
});
