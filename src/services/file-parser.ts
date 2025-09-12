'use server';

/**
 * @fileOverview A service to parse content from various file types.
 *
 * - `extractTextFromFile`: Extracts text from a file provided as a data URI.
 */

import { fileTypeFromBuffer } from 'file-type';
import PDFParser from 'node-pdf-parser';
import mammoth from 'mammoth';
import * as xlsx from 'xlsx';

type ParsedContent = {
    type: 'image' | 'document' | 'audio';
    content: string | null;
}

/**
 * Extracts text content from a file provided as a data URI.
 * Supports PDF, DOCX, TXT, XLSX, and PPTX files.
 * Identifies image and audio files.
 *
 * @param dataUri The data URI of the file.
 * @returns A promise that resolves to the parsed content.
 */
export async function extractTextFromFile(dataUri: string): Promise<ParsedContent> {
  const buffer = Buffer.from(dataUri.split(',')[1], 'base64');
  const fileType = await fileTypeFromBuffer(buffer);

  const mime = fileType?.mime;

  if (mime?.startsWith('image/')) {
      return { type: 'image', content: null };
  }
  
  if (mime?.startsWith('audio/')) {
    return { type: 'audio', content: null };
  }

  if (mime === 'application/pdf') {
    try {
        const pdfParser = new PDFParser(buffer);
        const isParsed = await pdfParser.pdfParser_dataReady();
        if (isParsed) {
            return { type: 'document', content: pdfParser.getRawTextContent() };
        }
        return { type: 'document', content: '' };
    } catch(err) {
        console.error("Error parsing PDF", err);
        throw new Error("Could not parse PDF file.")
    }
  }

  if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mime === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    const { value } = await mammoth.extractRawText({ buffer });
    return { type: 'document', content: value };
  }
  
  if (mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    let fullText = '';
    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const text = xlsx.utils.sheet_to_txt(worksheet);
        fullText += `Sheet: ${sheetName}\n\n${text}\n\n`;
    });
    return { type: 'document', content: fullText };
  }
  
  if (mime === 'text/plain') {
    return { type: 'document', content: buffer.toString('utf-8') };
  }

  // Fallback for other types, or if file-type fails
  console.warn(`Unsupported file type: ${mime}. Treating as a potential image or binary file.`);
  return { type: 'image', content: null };
}
