"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuizController = generateQuizController;
exports.submitQuizController = submitQuizController;
exports.attemptsListController = attemptsListController;
exports.progressController = progressController;
const pdf_repository_1 = require("../repositories/pdf.repository");
const quiz_repository_1 = require("../repositories/quiz.repository");
const ai_service_1 = require("../services/ai.service");
const quiz_service_1 = require("../services/quiz.service");
function generateQuizController(env) {
    return async (req, res) => {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { pdfId, numMCQ = 3, numSAQ = 1, numLAQ = 1, } = req.body;
        if (!pdfId) {
            res.status(400).json({ error: "pdfId required" });
            return;
        }
        const pdf = await (0, pdf_repository_1.getPdfById)(pdfId);
        if (!pdf) {
            res.status(404).json({ error: "PDF not found" });
            return;
        }
        const aiJson = await (0, ai_service_1.generateQuizWithAI)(env, {
            text: pdf.textPreview, // for demo; ideally store full text
            pdfTitle: pdf.originalName,
            numMCQ,
            numSAQ,
            numLAQ,
        });
        const parsed = (0, quiz_service_1.parseQuizJson)(aiJson.text);
        const quiz = await (0, quiz_repository_1.createQuiz)({
            ownerId: req.user.id,
            pdfId: pdf._id,
            title: parsed.title,
            questions: parsed.questions,
        });
        res.status(201).json(quiz);
    };
}
function submitQuizController(_env) {
    return async (req, res) => {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { id } = req.params;
        const quiz = await (0, quiz_repository_1.getQuizById)(id, req.user.id);
        if (!quiz) {
            res.status(404).json({ error: "Quiz not found" });
            return;
        }
        const answers = req.body;
        const result = (0, quiz_service_1.scoreAttempt)(quiz.questions, answers);
        const saved = await (0, quiz_repository_1.saveAttempt)({
            ownerId: req.user.id,
            quizId: quiz._id,
            answers: result.answers,
            totalScore: result.total,
        });
        res.status(201).json(saved);
    };
}
function attemptsListController(_env) {
    return async (req, res) => {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const items = await (0, quiz_repository_1.listAttempts)(req.user.id);
        res.json(items);
    };
}
function progressController(_env) {
    return async (req, res) => {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const report = await (0, quiz_repository_1.progress)(req.user.id);
        res.json(report);
    };
}
