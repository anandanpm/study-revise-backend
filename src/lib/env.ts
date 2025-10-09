import "dotenv/config"
import { z } from "zod"

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().regex(/^mongodb(\+srv)?:\/\//, "Invalid MongoDB URI"),
  MONGODB_DB_NAME: z.string().min(1),
  JWT_SECRET: z.string().min(24, "JWT_SECRET too short"),
  CORS_ORIGIN: z.string().min(1),
  AI_MODEL: z.string().default("openai/gpt-5-mini").optional(),
  OPENAI_API_KEY: z.string().min(1, "OpenAI API key is required"), // <-- added
})

export type Env = z.infer<typeof EnvSchema>

export function loadEnv(): Env {
  return EnvSchema.parse(process.env)
}
