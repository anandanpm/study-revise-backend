import { Router } from "express"
import type { Env } from "../lib/env.js"
import { requireAuth } from "../middleware/auth.js"
import {
  attemptsListController,
  generateQuizController,
  progressController,
  submitQuizController,
} from "../controllers/quiz.controller.js"

export function quizRouter(env: Env): Router {
  const r = Router()
  r.post("/generate", requireAuth(env), generateQuizController(env))
  r.post("/:id/submit", requireAuth(env), submitQuizController(env))
  r.get("/attempts", requireAuth(env), attemptsListController(env))
  r.get("/progress", requireAuth(env), progressController(env))
  return r
}
