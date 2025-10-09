import { createServer } from "./server"
import { connectMongo } from "./lib/db"
import { loadEnv } from "./lib/env"

async function main(): Promise<void> {
  const env = loadEnv()
  await connectMongo(env.MONGODB_URI, env.MONGODB_DB_NAME)
  const app = createServer(env)

  app.listen(env.PORT, () => {
    console.log(`[server] listening on http://localhost:${env.PORT}`)
  })
}

main().catch((err) => {
  console.error("[server] fatal error", err)
  process.exit(1)
})
