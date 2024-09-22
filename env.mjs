import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core';

// Define a Zod schema for environment variables, adding validation for AWS and MongoDB credentials
export const env = createEnv({
  server: {
    // AWS S3 credentials
    AWS_ACCESS_KEY_ID: z.string().min(1, { message: "AWS_ACCESS_KEY_ID is required" }),
    AWS_SECRET_ACCESS_KEY: z.string().min(1, { message: "AWS_SECRET_ACCESS_KEY is required" }),
    AWS_REGION: z.string().min(1, { message: "AWS_REGION is required" }),
    S3_BUCKET_NAME: z.string().min(1, { message: "S3_BUCKET_NAME is required" }),

    // MongoDB URI
    MONGODB_URI: z.string().url({ message: "MONGODB_URI must be a valid URL" }),

    // Other potential environment variables
    // Add any other server-side environment variables you need
  },
  client: {
    // Example: API endpoint used on the client side
    NEXT_PUBLIC_API_URL: z.string().url({ message: "NEXT_PUBLIC_API_URL must be a valid URL" }),

    // Add any other client-side environment variables
  },
  runtimeEnv: {
    // Assign runtime values from process.env to the validated schema
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,

    MONGODB_URI: process.env.MONGODB_URI,

    // Assign client variables (client-side accessible)
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
});
