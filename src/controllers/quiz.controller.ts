import type { Response } from "express"
import type { AuthedRequest } from "../middleware/auth.js"
import type { Env } from "../lib/env.js"
import { getPdfById } from "../repositories/pdf.repository.js"
import { createQuiz, getQuizById, listAttempts, progress, saveAttempt } from "../repositories/quiz.repository.js"
import { generateQuizWithAI } from "../services/ai.service.js"
import { parseQuizJson, scoreAttempt } from "../services/quiz.service.js"

export function generateQuizController(env: Env) {
  return async (req: AuthedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }
    const {
      pdfId,
      numMCQ = 3,
      numSAQ = 1,
      numLAQ = 1,
    } = req.body as {
      pdfId?: string
      numMCQ?: number
      numSAQ?: number
      numLAQ?: number
    }
    if (!pdfId) {
      res.status(400).json({ error: "pdfId required" })
      return
    }
    const pdf = await getPdfById(pdfId)
    if (!pdf) {
      res.status(404).json({ error: "PDF not found" })
      return
    }

    const aiJson = await generateQuizWithAI(env, {
      text: pdf.textPreview, // for demo; ideally store full text
      pdfTitle: pdf.originalName,
      numMCQ,
      numSAQ,
      numLAQ,
    })
    const parsed = parseQuizJson(aiJson)
    const quiz = await createQuiz({
      ownerId: req.user.id,
      pdfId: pdf._id,
      title: parsed.title,
      questions: parsed.questions,
    })
    res.status(201).json(quiz)
  }
}

export function submitQuizController(_env: Env) {
  return async (req: AuthedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }
    const { id } = req.params as { id: string }
    const quiz = await getQuizById(id, req.user.id)
    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" })
      return
    }

    const answers = req.body as Record<string, string | number>
    const result = scoreAttempt(quiz.questions, answers)
    const saved = await saveAttempt({
      ownerId: req.user.id,
      quizId: quiz._id,
      answers: result.answers,
      totalScore: result.total,
    })
    res.status(201).json(saved)
  }
}

export function attemptsListController(_env: Env) {
  return async (req: AuthedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }
    const items = await listAttempts(req.user.id)
    res.json(items)
  }
}

export function progressController(_env: Env) {
  return async (req: AuthedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }
    const report = await progress(req.user.id)
    res.json(report)
  }
}
