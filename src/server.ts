import express, { type Express } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { Env } from "./lib/env"
import { authRouter } from "./routes/auth.route"
import { pdfRouter } from "./routes/pdf.route"
import { quizRouter } from "./routes/quiz.route"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function createServer(env: Env): Express {
  const app = express()

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  )
  app.use(cookieParser())
  app.use(express.json({ limit: "10mb" }))
  app.use(express.urlencoded({ extended: true }))

  // Static serve uploaded PDFs
  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")))

  app.get("/health", (_req, res) => res.json({ ok: true }))

  app.use("/api/auth", authRouter(env))
  app.use("/api/pdfs", pdfRouter(env))
  app.use("/api/quizzes", quizRouter(env))

  return app
}
