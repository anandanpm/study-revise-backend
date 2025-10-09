"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePdfFile = parsePdfFile;
const node_fs_1 = __importDefault(require("node:fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
async function parsePdfFile(filePath) {
    const data = await node_fs_1.default.promises.readFile(filePath);
    const result = await (0, pdf_parse_1.default)(data);
    const pageCount = result.numpages ?? result.text.split("\f").length; // fallback
    return { text: result.text, pageCount };
}
