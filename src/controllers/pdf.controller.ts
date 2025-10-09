import type { Request, Response } from "express"
import path from "node:path"
import { parsePdfFile } from "../services/pdf.service.js"
import { addPdf, listPdfs, getPdfById, seedPdf } from "../repositories/pdf.repository.js"
import type { AuthedRequest } from "../middleware/auth.js"
import type { Env } from "../lib/env.js"

export function seedNcertController(env: Env) {
  return async (_req: Request, res: Response): Promise<void> => {
    const samples = [
      {
        ownerId: "seed",
        filename: "ncert-physics-xi-ch1.pdf",
        originalName: "NCERT XI Physics - Chapter 1",
        urlPath: "/uploads/seed-ncert-physics-xi-ch1.pdf",
        pageCount: 50,
        textPreview: "Units and Measurements...",
        createdAt: new Date(),
        seeded: true,
      },
      {
        ownerId: "seed",
        filename: "ncert-physics-xi-ch2.pdf",
        originalName: "NCERT XI Physics - Chapter 2",
        urlPath: "/uploads/seed-ncert-physics-xi-ch2.pdf",
        pageCount: 45,
        textPreview: "Motion in a Straight Line...",
        createdAt: new Date(),
        seeded: true,
      },
    ]
    await Promise.all(samples.map(seedPdf))
    res.json({ ok: true })
  }
}

export function uploadPdfController(env: Env) {
  return async (req: AuthedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }
    const file = (req as Request & { file?: Express.Multer.File }).file
    if (!file) {
      res.status(400).json({ error: "No file uploaded" })
      return
    }
    const filePath = path.join(process.cwd(), "backend", "uploads", file.filename)
    const parsed = await parsePdfFile(filePath)
    const saved = await addPdf({
      ownerId: req.user.id,
      filename: file.filename,
      originalName: file.originalname,
      urlPath: `/uploads/${file.filename}`,
      pageCount: parsed.pageCount,
      textPreview: parsed.text.slice(0, 300),
      createdAt: new Date(),
    })
    res.status(201).json(saved)
  }
}

export function listPdfController(_env: Env) {
  return async (req: AuthedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }
    const docs = await listPdfs(req.user.id)
    res.json(docs)
  }
}

export function getPdfController(_env: Env) {
  return async (req: AuthedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }
    const pdf = await getPdfById(req.params.id)
    if (!pdf) {
      res.status(404).json({ error: "Not found" })
      return
    }
    res.json(pdf)
  }
}
