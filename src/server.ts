import express, { type Express, type Request, type Response, type NextFunction } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import type { Env } from "./lib/env"
import { authRouter } from "./routes/auth.route"
import { pdfRouter } from "./routes/pdf.route"
import { quizRouter } from "./routes/quiz.route"

export function createServer(env: Env): Express {
  const app = express()

  

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  )

  app.use(cookieParser())
  app.use(express.json({ limit: "10mb" }))
  app.use(express.urlencoded({ extended: true }))

  // Middleware to log incoming requests
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[Request] ${req.method} ${req.url}`)
    if (req.method === "POST" || req.method === "PUT") {
      console.log("[Body]", req.body)
    }
    next()
  })

  // Static serve uploaded PDFs
    app.use("/uploads", express.static(path.join(process.cwd(), "backend", "uploads")))

  app.get("/health", (_req, res) => res.json({ ok: true }))

  app.use("/api/auth", authRouter(env))
  app.use("/api/pdfs", pdfRouter(env))
  app.use("/api/quizzes", quizRouter(env))

  return app
}
