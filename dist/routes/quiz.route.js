"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizRouter = quizRouter;
const express_1 = require("express");
const auth_js_1 = require("../middleware/auth.js");
const quiz_controller_js_1 = require("../controllers/quiz.controller.js");
function quizRouter(env) {
    const r = (0, express_1.Router)();
    r.post("/generate", (0, auth_js_1.requireAuth)(env), (0, quiz_controller_js_1.generateQuizController)(env));
    r.post("/:id/submit", (0, auth_js_1.requireAuth)(env), (0, quiz_controller_js_1.submitQuizController)(env));
    r.get("/attempts", (0, auth_js_1.requireAuth)(env), (0, quiz_controller_js_1.attemptsListController)(env));
    r.get("/progress", (0, auth_js_1.requireAuth)(env), (0, quiz_controller_js_1.progressController)(env));
    return r;
}
