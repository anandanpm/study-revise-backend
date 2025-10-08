export interface User {
  _id: string
  email: string
  passwordHash: string
  createdAt: Date
}

export interface PdfDoc {
  _id: string
  ownerId: string
  filename: string
  originalName: string
  urlPath: string
  pageCount: number
  textPreview: string
  createdAt: Date
  seeded?: boolean
}

export type QuestionType = "MCQ" | "SAQ" | "LAQ"

export interface BaseQuestion {
  id: string
  type: QuestionType
  prompt: string
  pageRef?: number
  explanation?: string
}

export interface McqQuestion extends BaseQuestion {
  type: "MCQ"
  options: string[]
  correctOptionIndex: number
}

export interface SaqQuestion extends BaseQuestion {
  type: "SAQ"
  expectedAnswer: string
}

export interface LaqQuestion extends BaseQuestion {
  type: "LAQ"
  expectedAnswerOutline: string
}

export type Question = McqQuestion | SaqQuestion | LaqQuestion

export interface Quiz {
  _id: string
  ownerId: string
  pdfId: string
  title: string
  questions: Question[]
  createdAt: Date
}

export interface AttemptAnswer {
  questionId: string
  answer: string | number
  correct: boolean
  score: number
}

export interface Attempt {
  _id: string
  ownerId: string
  quizId: string
  answers: AttemptAnswer[]
  totalScore: number
  createdAt: Date
}

export interface ProgressSnapshot {
  totalQuizzes: number
  totalAttempts: number
  averageScore: number
  strengths: string[]
  weaknesses: string[]
}
