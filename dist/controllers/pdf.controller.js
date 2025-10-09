"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedNcertController = seedNcertController;
exports.uploadPdfController = uploadPdfController;
exports.listPdfController = listPdfController;
exports.getPdfController = getPdfController;
const node_path_1 = __importDefault(require("node:path"));
const pdf_service_1 = require("../services/pdf.service");
const pdf_repository_1 = require("../repositories/pdf.repository");
function seedNcertController(env) {
    return async (_req, res) => {
        const samples = [
            {
                ownerId: "seed",
                filename: "ncert-physics-xi-ch1.pdf",
                originalName: "NCERT XI Physics - Chapter 1",
                urlPath: "/uploads/seed-ncert-physics-xi-ch1.pdf",
                pageCount: 50,
                textPreview: "Units and Measurements...",
                createdAt: new Date(),
                seeded: true,
            },
            {
                ownerId: "seed",
                filename: "ncert-physics-xi-ch2.pdf",
                originalName: "NCERT XI Physics - Chapter 2",
                urlPath: "/uploads/seed-ncert-physics-xi-ch2.pdf",
                pageCount: 45,
                textPreview: "Motion in a Straight Line...",
                createdAt: new Date(),
                seeded: true,
            },
        ];
        await Promise.all(samples.map(pdf_repository_1.seedPdf));
        res.json({ ok: true });
    };
}
function uploadPdfController(env) {
    return async (req, res) => {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const file = req.file;
        if (!file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
        const filePath = node_path_1.default.join(process.cwd(), "backend", "uploads", file.filename);
        const parsed = await (0, pdf_service_1.parsePdfFile)(filePath);
        const saved = await (0, pdf_repository_1.addPdf)({
            ownerId: req.user.id,
            filename: file.filename,
            originalName: file.originalname,
            urlPath: `/uploads/${file.filename}`,
            pageCount: parsed.pageCount,
            textPreview: parsed.text.slice(0, 300),
            createdAt: new Date(),
        });
        res.status(201).json(saved);
    };
}
function listPdfController(_env) {
    return async (req, res) => {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const docs = await (0, pdf_repository_1.listPdfs)(req.user.id);
        res.json(docs);
    };
}
function getPdfController(_env) {
    return async (req, res) => {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const pdf = await (0, pdf_repository_1.getPdfById)(req.params.id);
        if (!pdf) {
            res.status(404).json({ error: "Not found" });
            return;
        }
        res.json(pdf);
    };
}
