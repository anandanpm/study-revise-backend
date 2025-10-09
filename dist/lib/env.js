"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = loadEnv;
require("dotenv/config");
const zod_1 = require("zod");
const EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    MONGODB_URI: zod_1.z.string().regex(/^mongodb(\+srv)?:\/\//, "Invalid MongoDB URI"),
    MONGODB_DB_NAME: zod_1.z.string().min(1),
    JWT_SECRET: zod_1.z.string().min(24, "JWT_SECRET too short"),
    CORS_ORIGIN: zod_1.z.string().min(1),
    AI_MODEL: zod_1.z.string().default("openai/gpt-5-mini").optional(),
    OPENAI_API_KEY: zod_1.z.string().min(1, "OpenAI API key is required"), // <-- added
});
function loadEnv() {
    return EnvSchema.parse(process.env);
}
