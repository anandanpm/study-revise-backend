import { ObjectId } from "mongodb"
import { collection } from "../lib/db"
import type { PdfDoc } from "../types/entities"

const pdfsCol = () => collection<PdfDoc>("pdfs")

export async function addPdf(doc: Omit<PdfDoc, "_id">): Promise<PdfDoc> {
  const id = new ObjectId().toHexString()
  await pdfsCol().insertOne({ ...doc, _id: id })
  const inserted = await pdfsCol().findOne({ _id: id })
  if (!inserted) throw new Error("PDF insert failed")
  return inserted
}

export async function listPdfs(ownerId: string): Promise<PdfDoc[]> {
  return pdfsCol()
    .find({ $or: [{ ownerId }, { seeded: true }] })
    .sort({ createdAt: -1 })
    .toArray()
}

export async function getPdfById(id: string): Promise<PdfDoc | null> {
  return pdfsCol().findOne({ _id: id })
}

export async function seedPdf(doc: Omit<PdfDoc, "_id">): Promise<void> {
  const exists = await pdfsCol().findOne({ urlPath: doc.urlPath })
  if (!exists) {
    await addPdf({ ...doc, seeded: true })
  }
}
