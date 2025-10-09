"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const auth_route_1 = require("./routes/auth.route");
const pdf_route_1 = require("./routes/pdf.route");
const quiz_route_1 = require("./routes/quiz.route");
function createServer(env) {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: env.CORS_ORIGIN,
        credentials: true,
    }));
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.json({ limit: "10mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    // Static serve uploaded PDFs
    app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
    app.get("/health", (_req, res) => res.json({ ok: true }));
    app.use("/api/auth", (0, auth_route_1.authRouter)(env));
    app.use("/api/pdfs", (0, pdf_route_1.pdfRouter)(env));
    app.use("/api/quizzes", (0, quiz_route_1.quizRouter)(env));
    return app;
}
