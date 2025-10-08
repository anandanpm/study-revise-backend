import { z } from "zod"
import type { Question, AttemptAnswer, McqQuestion, SaqQuestion, LaqQuestion } from "../types/entities.js"

const McqSchema = z.object({
  id: z.string(),
  type: z.literal("MCQ"),
  prompt: z.string(),
  options: z.array(z.string()).min(2),
  correctOptionIndex: z.number().int().min(0),
  explanation: z.string().optional(),
  pageRef: z.number().int().optional(),
})
const SaqSchema = z.object({
  id: z.string(),
  type: z.literal("SAQ"),
  prompt: z.string(),
  expectedAnswer: z.string(),
  explanation: z.string().optional(),
  pageRef: z.number().int().optional(),
})
const LaqSchema = z.object({
  id: z.string(),
  type: z.literal("LAQ"),
  prompt: z.string(),
  expectedAnswerOutline: z.string(),
  explanation: z.string().optional(),
  pageRef: z.number().int().optional(),
})
const QuestionSchema = z.discriminatedUnion("type", [McqSchema, SaqSchema, LaqSchema])
const QuizJsonSchema = z.object({
  title: z.string(),
  questions: z.array(QuestionSchema).min(1),
})

export function parseQuizJson(jsonText: string): { title: string; questions: Question[] } {
  const candidate = JSON.parse(jsonText) as unknown
  const parsed = QuizJsonSchema.parse(candidate)
  return parsed
}


export function scoreAttempt(
  questions: Question[],
  answers: Record<string, string | number>,
): { answers: AttemptAnswer[]; total: number } {
  const results: AttemptAnswer[] = []
  let total = 0
  for (const q of questions) {
    if (q.type === "MCQ") {
      const selected = answers[q.id]
      const correct = typeof selected === "number" && selected === (q as McqQuestion).correctOptionIndex
      const score = correct ? 1 : 0
      results.push({ questionId: q.id, answer: selected ?? "", correct, score })
      total += score
    } else if (q.type === "SAQ") {
      const provided = String(answers[q.id] ?? "")
      const exp = (q as SaqQuestion).expectedAnswer.toLowerCase()
      const correct = provided.toLowerCase().includes(exp.split(" ").slice(0, 3).join(" "))
      const score = correct ? 1 : 0.5 // partial
      results.push({ questionId: q.id, answer: provided, correct, score })
      total += score
    } else {
      const provided = String(answers[q.id] ?? "")
      const exp = (q as LaqQuestion).expectedAnswerOutline.toLowerCase()
      const correct = provided.toLowerCase().includes(exp.split(" ").slice(0, 4).join(" "))
      const score = correct ? 2 : 1 // give weight
      results.push({ questionId: q.id, answer: provided, correct, score })
      total += score
    }
  }
  return { answers: results, total }
}
