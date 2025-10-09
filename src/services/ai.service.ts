// import type { Env } from "../lib/env"
// import { generateText,LanguageModelV1 } from "ai"

// export interface GenerateQuizInput {
//   text: string
//   pdfTitle: string
//   numMCQ: number
//   numSAQ: number
//   numLAQ: number
// }

// export async function generateQuizWithAI(env: Env, input: GenerateQuizInput): Promise<string> {
//   try {
//     const { text } = await generateText({
//       model: (env.AI_MODEL ?? "openai/gpt-5-mini")as unknown as LanguageModelV1,
//       maxTokens: 1000,
//       system: "You are a strict quiz generator that outputs ONLY valid JSON.",
//       prompt:
//         `From the coursebook text below, generate ${input.numMCQ} MCQs, ${input.numSAQ} SAQs, ` +
//         `${input.numLAQ} LAQs with explanations. Include pageRef guesses when possible.\n\n` +
//         `Return JSON of shape: {\n` +
//         `"title": "string",\n` +
//         `"questions": [\n` +
//         `  { "id": "string", "type": "MCQ", "prompt": "string", "options": ["A","B","C","D"], "correctOptionIndex": 0, "explanation": "string", "pageRef": 1 },\n` +
//         `  { "id": "string", "type": "SAQ", "prompt": "string", "expectedAnswer": "string", "explanation": "string", "pageRef": 2 },\n` +
//         `  { "id": "string", "type": "LAQ", "prompt": "string", "expectedAnswerOutline": "string", "explanation": "string", "pageRef": 3 }\n` +
//         `]}\n\n` +
//         `TEXT (title: ${input.pdfTitle}):\n` +
//         input.text.slice(0, 12000),
//     })
//     return text
//   } catch {
//     // Fallback deterministic simple JSON
//     return JSON.stringify({
//       title: `${input.pdfTitle} - Practice Quiz`,
//       questions: [
//         {
//           id: "mcq-1",
//           type: "MCQ",
//           prompt: "Which unit is used for force in SI?",
//           options: ["Joule", "Newton", "Watt", "Pascal"],
//           correctOptionIndex: 1,
//           explanation: "Force is measured in Newton (N).",
//           pageRef: 1,
//         },
//         {
//           id: "saq-1",
//           type: "SAQ",
//           prompt: "Define velocity.",
//           expectedAnswer: "Velocity is the rate of change of displacement with respect to time.",
//           explanation: "Velocity has magnitude and direction.",
//           pageRef: 2,
//         },
//         {
//           id: "laq-1",
//           type: "LAQ",
//           prompt: "Explain Newton’s three laws of motion with examples.",
//           expectedAnswerOutline: "State each law and provide a real-world example.",
//           explanation: "Covers inertia, F=ma, action-reaction.",
//           pageRef: 3,
//         },
//       ],
//     })
//   }
// }



import type { Env } from "../lib/env"
import OpenAI from "openai"

export interface GenerateQuizInput {
  text: string
  pdfTitle: string
  numMCQ: number
  numSAQ: number
  numLAQ: number
}

export interface GeneratedQuizResult {
  aiUsed: boolean
  text: string
}

export async function generateQuizWithAI(
  env: Env,
  input: GenerateQuizInput
): Promise<GeneratedQuizResult> {
  try {
    console.log("🟢 AI generation started for PDF:", input.pdfTitle)

    if (!env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY not set in environment")
    }

    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    })

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "You are a strict quiz generator that outputs ONLY valid JSON.",
        },
        {
          role: "user",
          content:
            `From the coursebook text below, generate ${input.numMCQ} MCQs, ${input.numSAQ} SAQs, ` +
            `${input.numLAQ} LAQs with explanations. Include pageRef guesses when possible.\n\n` +
            `Return JSON of shape: {\n` +
            `"title": "string",\n` +
            `"questions": [\n` +
            `  { "id": "string", "type": "MCQ", "prompt": "string", "options": ["A","B","C","D"], "correctOptionIndex": 0, "explanation": "string", "pageRef": 1 },\n` +
            `  { "id": "string", "type": "SAQ", "prompt": "string", "expectedAnswer": "string", "explanation": "string", "pageRef": 2 },\n` +
            `  { "id": "string", "type": "LAQ", "prompt": "string", "expectedAnswerOutline": "string", "explanation": "string", "pageRef": 3 }\n` +
            `]}\n\n` +
            `TEXT (title: ${input.pdfTitle}):\n` +
            input.text.slice(0, 12000),
        },
      ],
    })

    const text = completion.choices[0]?.message?.content || ""
    console.log("🟢 AI generation succeeded")
    return { aiUsed: true, text }
  } catch (err) {
    console.log("🔴 AI generation failed, using fallback", err)

    const fallback = JSON.stringify({
      title: `${input.pdfTitle} - Practice Quiz`,
      questions: [
        {
          id: "mcq-1",
          type: "MCQ",
          prompt: "Which unit is used for force in SI?",
          options: ["Joule", "Newton", "Watt", "Pascal"],
          correctOptionIndex: 1,
          explanation: "Force is measured in Newton (N).",
          pageRef: 1,
        },
        {
          id: "saq-1",
          type: "SAQ",
          prompt: "Define velocity.",
          expectedAnswer: "Velocity is the rate of change of displacement with respect to time.",
          explanation: "Velocity has magnitude and direction.",
          pageRef: 2,
        },
        {
          id: "laq-1",
          type: "LAQ",
          prompt: "Explain Newton's three laws of motion with examples.",
          expectedAnswerOutline: "State each law and provide a real-world example.",
          explanation: "Covers inertia, F=ma, action-reaction.",
          pageRef: 3,
        },
      ],
    })

    return { aiUsed: false, text: fallback }
  }
}