import { Router } from "express"
import multer from "multer"
import path from "node:path"
import fs from "node:fs"
import type { Env } from "../lib/env.js"
import { requireAuth } from "../middleware/auth.js"
import {
  uploadPdfController,
  listPdfController,
  getPdfController,
  seedNcertController,
} from "../controllers/pdf.controller.js"

const uploadDir = path.join(process.cwd(), "backend", "uploads")
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "-").toLowerCase()
    cb(null, `${Date.now()}-${safe}`)
  },
})
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") cb(new Error("Only PDF allowed"))
    else cb(null, true)
  },
  limits: { fileSize: 20 * 1024 * 1024 },
})

export function pdfRouter(env: Env): Router {
  const r = Router()
  r.post("/seed", seedNcertController(env))
  r.post("/upload", requireAuth(env), upload.single("pdf"), uploadPdfController(env))
  r.get("/", requireAuth(env), listPdfController(env))
  r.get("/:id", requireAuth(env), getPdfController(env))
  return r
}
