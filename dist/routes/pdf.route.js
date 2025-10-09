"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfRouter = pdfRouter;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const auth_js_1 = require("../middleware/auth.js");
const pdf_controller_js_1 = require("../controllers/pdf.controller.js");
const uploadDir = node_path_1.default.join(process.cwd(), "backend", "uploads");
if (!node_fs_1.default.existsSync(uploadDir))
    node_fs_1.default.mkdirSync(uploadDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const safe = file.originalname.replace(/\s+/g, "-").toLowerCase();
        cb(null, `${Date.now()}-${safe}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype !== "application/pdf")
            cb(new Error("Only PDF allowed"));
        else
            cb(null, true);
    },
    limits: { fileSize: 20 * 1024 * 1024 },
});
function pdfRouter(env) {
    const r = (0, express_1.Router)();
    r.post("/seed", (0, pdf_controller_js_1.seedNcertController)(env));
    r.post("/upload", (0, auth_js_1.requireAuth)(env), upload.single("pdf"), (0, pdf_controller_js_1.uploadPdfController)(env));
    r.get("/", (0, auth_js_1.requireAuth)(env), (0, pdf_controller_js_1.listPdfController)(env));
    r.get("/:id", (0, auth_js_1.requireAuth)(env), (0, pdf_controller_js_1.getPdfController)(env));
    return r;
}
