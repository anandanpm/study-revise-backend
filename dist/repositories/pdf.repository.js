"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPdf = addPdf;
exports.listPdfs = listPdfs;
exports.getPdfById = getPdfById;
exports.seedPdf = seedPdf;
const mongodb_1 = require("mongodb");
const db_1 = require("../lib/db");
const pdfsCol = () => (0, db_1.collection)("pdfs");
async function addPdf(doc) {
    const id = new mongodb_1.ObjectId().toHexString();
    await pdfsCol().insertOne({ ...doc, _id: id });
    const inserted = await pdfsCol().findOne({ _id: id });
    if (!inserted)
        throw new Error("PDF insert failed");
    return inserted;
}
async function listPdfs(ownerId) {
    return pdfsCol()
        .find({ $or: [{ ownerId }, { seeded: true }] })
        .sort({ createdAt: -1 })
        .toArray();
}
async function getPdfById(id) {
    return pdfsCol().findOne({ _id: id });
}
async function seedPdf(doc) {
    const exists = await pdfsCol().findOne({ urlPath: doc.urlPath });
    if (!exists) {
        await addPdf({ ...doc, seeded: true });
    }
}
