import { PDFDocument } from 'pdf-lib'
import { readFile, writeFile } from 'fs/promises'

const path = './public/Kenil-Sudani-Resume.pdf'
const pdfDoc = await PDFDocument.load(await readFile(path))
pdfDoc.setTitle('Kenil Sudani Resume')
pdfDoc.setAuthor('Kenil Sudani')

await writeFile(path, await pdfDoc.save())
