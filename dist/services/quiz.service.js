"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQuizJson = parseQuizJson;
exports.scoreAttempt = scoreAttempt;
const zod_1 = require("zod");
const McqSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.literal("MCQ"),
    prompt: zod_1.z.string(),
    options: zod_1.z.array(zod_1.z.string()).min(2),
    correctOptionIndex: zod_1.z.number().int().min(0),
    explanation: zod_1.z.string().optional(),
    pageRef: zod_1.z.number().int().optional(),
});
const SaqSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.literal("SAQ"),
    prompt: zod_1.z.string(),
    expectedAnswer: zod_1.z.string(),
    explanation: zod_1.z.string().optional(),
    pageRef: zod_1.z.number().int().optional(),
});
const LaqSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.literal("LAQ"),
    prompt: zod_1.z.string(),
    expectedAnswerOutline: zod_1.z.string(),
    explanation: zod_1.z.string().optional(),
    pageRef: zod_1.z.number().int().optional(),
});
const QuestionSchema = zod_1.z.discriminatedUnion("type", [McqSchema, SaqSchema, LaqSchema]);
const QuizJsonSchema = zod_1.z.object({
    title: zod_1.z.string(),
    questions: zod_1.z.array(QuestionSchema).min(1),
});
function parseQuizJson(jsonText) {
    const candidate = JSON.parse(jsonText);
    const parsed = QuizJsonSchema.parse(candidate);
    return parsed;
}
function scoreAttempt(questions, answers) {
    const results = [];
    let total = 0;
    for (const q of questions) {
        if (q.type === "MCQ") {
            const selected = answers[q.id];
            const correct = typeof selected === "number" && selected === q.correctOptionIndex;
            const score = correct ? 1 : 0;
            results.push({ questionId: q.id, answer: selected ?? "", correct, score });
            total += score;
        }
        else if (q.type === "SAQ") {
            const provided = String(answers[q.id] ?? "");
            const exp = q.expectedAnswer.toLowerCase();
            const correct = provided.toLowerCase().includes(exp.split(" ").slice(0, 3).join(" "));
            const score = correct ? 1 : 0.5; // partial
            results.push({ questionId: q.id, answer: provided, correct, score });
            total += score;
        }
        else {
            const provided = String(answers[q.id] ?? "");
            const exp = q.expectedAnswerOutline.toLowerCase();
            const correct = provided.toLowerCase().includes(exp.split(" ").slice(0, 4).join(" "));
            const score = correct ? 2 : 1; // give weight
            results.push({ questionId: q.id, answer: provided, correct, score });
            total += score;
        }
    }
    return { answers: results, total };
}
