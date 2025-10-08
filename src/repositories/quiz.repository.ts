import { ObjectId } from "mongodb"
import { collection } from "../lib/db.js"
import type { Attempt, ProgressSnapshot, Quiz } from "../types/entities.js"

const quizzesCol = () => collection<Quiz>("quizzes")
const attemptsCol = () => collection<Attempt>("attempts")

export async function createQuiz(quiz: Omit<Quiz, "_id" | "createdAt">): Promise<Quiz> {
  const id = new ObjectId().toHexString()
  const created: Quiz = { ...quiz, _id: id, createdAt: new Date() }
  await quizzesCol().insertOne(created)
  return created
}

export async function getQuizById(id: string, ownerId: string): Promise<Quiz | null> {
  return quizzesCol().findOne({ _id: id, ownerId })
}

export async function saveAttempt(attempt: Omit<Attempt, "_id" | "createdAt">): Promise<Attempt> {
  const id = new ObjectId().toHexString()
  const created: Attempt = { ...attempt, _id: id, createdAt: new Date() }
  await attemptsCol().insertOne(created)
  return created
}

export async function listAttempts(ownerId: string): Promise<Attempt[]> {
  return attemptsCol().find({ ownerId }).sort({ createdAt: -1 }).toArray()
}

export async function progress(ownerId: string): Promise<ProgressSnapshot> {
  const [totalQuizzes, attempts] = await Promise.all([
    quizzesCol().countDocuments({ ownerId }),
    attemptsCol().find({ ownerId }).toArray(),
  ])
  const totalAttempts = attempts.length
  const averageScore = totalAttempts
    ? Number.parseFloat((attempts.reduce((sum, a) => sum + a.totalScore, 0) / totalAttempts).toFixed(2))
    : 0
  // simplistic strengths/weaknesses based on per-attempt performance
  const strengths: string[] = averageScore >= 70 ? ["MCQ"] : []
  const weaknesses: string[] = averageScore < 70 ? ["LAQ", "SAQ"] : []
  return { totalQuizzes, totalAttempts, averageScore, strengths, weaknesses }
}
