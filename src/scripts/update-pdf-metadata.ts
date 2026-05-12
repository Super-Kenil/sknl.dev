import { PDFDocument } from 'pdf-lib'
import { readFile, writeFile } from 'fs/promises'

import { AUTHOR_NAME } from '../consts'

const path = './public/Kenil-Sudani-Resume.pdf'
const pdfDoc = await PDFDocument.load(await readFile(path))
pdfDoc.setTitle(`${AUTHOR_NAME} Resume`)
pdfDoc.setAuthor(AUTHOR_NAME)

await writeFile(path, await pdfDoc.save())
