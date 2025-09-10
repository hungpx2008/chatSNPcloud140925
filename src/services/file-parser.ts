'use server';

/**
 * @fileOverview A service to parse content from various file types.
 *
 * - `extractTextFromFile`: Extracts text from a file provided as a data URI.
 */

import { fileTypeFromBuffer } from 'file-type';
import PDFParser from 'node-pdf-parser';
import mammoth from 'mammoth';

type ParsedContent = {
    type: 'image' | 'document';
    content: string | null;
}

/**
 * Extracts text content from a file provided as a data URI.
 * Supports PDF, DOCX, and TXT files.
 * If the file is an image, it identifies it as such.
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

  if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const { value } = await mammoth.extractRawText({ buffer });
    return { type: 'document', content: value };
  }

  if (mime === 'text/plain') {
    return { type: 'document', content: buffer.toString('utf-8') };
  }

  // Fallback for other types, or if file-type fails
  console.warn(`Unsupported file type: ${mime}. Treating as a potential image or binary file.`);
  return { type: 'image', content: null };
}
