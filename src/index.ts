import { createServer } from "./server"
import { connectMongo } from "./lib/db"
import { loadEnv } from "./lib/env"

async function main(): Promise<void> {
  try {
    const env = loadEnv()

    console.log("[server] Starting server...")
    console.log("[server] Connecting to MongoDB...")

    const db = await connectMongo(env.MONGODB_URI, env.MONGODB_DB_NAME)
    console.log(`[MongoDB] Connected successfully to database: ${env.MONGODB_DB_NAME} ✅`)

    const app = createServer(env)

    app.listen(env.PORT, () => {
      console.log(`[server] Listening on http://localhost:${env.PORT}`)
    })
  } catch (err) {
    console.error("[server] Fatal startup error:", err)
    process.exit(1)
  }
}

main()
