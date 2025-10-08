import fs from "node:fs"
import pdfParse from "pdf-parse"

export interface ParsedPdf {
  text: string
  pageCount: number
}

export async function parsePdfFile(filePath: string): Promise<ParsedPdf> {
  const data = await fs.promises.readFile(filePath)
  const result = await pdfParse(data)
  const pageCount = result.numpages ?? result.text.split("\f").length // fallback
  return { text: result.text, pageCount }
}
