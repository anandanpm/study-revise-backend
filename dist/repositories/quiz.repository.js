"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuiz = createQuiz;
exports.getQuizById = getQuizById;
exports.saveAttempt = saveAttempt;
exports.listAttempts = listAttempts;
exports.progress = progress;
const mongodb_1 = require("mongodb");
const db_1 = require("../lib/db");
const quizzesCol = () => (0, db_1.collection)("quizzes");
const attemptsCol = () => (0, db_1.collection)("attempts");
async function createQuiz(quiz) {
    const id = new mongodb_1.ObjectId().toHexString();
    const created = { ...quiz, _id: id, createdAt: new Date() };
    await quizzesCol().insertOne(created);
    return created;
}
async function getQuizById(id, ownerId) {
    return quizzesCol().findOne({ _id: id, ownerId });
}
async function saveAttempt(attempt) {
    const id = new mongodb_1.ObjectId().toHexString();
    const created = { ...attempt, _id: id, createdAt: new Date() };
    await attemptsCol().insertOne(created);
    return created;
}
async function listAttempts(ownerId) {
    return attemptsCol().find({ ownerId }).sort({ createdAt: -1 }).toArray();
}
async function progress(ownerId) {
    const [totalQuizzes, attempts] = await Promise.all([
        quizzesCol().countDocuments({ ownerId }),
        attemptsCol().find({ ownerId }).toArray(),
    ]);
    const totalAttempts = attempts.length;
    const averageScore = totalAttempts
        ? Number.parseFloat((attempts.reduce((sum, a) => sum + a.totalScore, 0) / totalAttempts).toFixed(2))
        : 0;
    // simplistic strengths/weaknesses based on per-attempt performance
    const strengths = averageScore >= 70 ? ["MCQ"] : [];
    const weaknesses = averageScore < 70 ? ["LAQ", "SAQ"] : [];
    return { totalQuizzes, totalAttempts, averageScore, strengths, weaknesses };
}
