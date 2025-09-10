/**
 * @fileOverview A service to parse content from various file types.
 *
 * - `extractTextFromFile`: Extracts text from a file provided as a data URI.
 */

import { fromBuffer } from 'file-type';
import pdf from 'pdf-parse';
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
  const fileType = await fromBuffer(buffer);

  const mime = fileType?.mime;

  if (mime?.startsWith('image/')) {
      return { type: 'image', content: null };
  }

  if (mime === 'application/pdf') {
    const data = await pdf(buffer);
    return { type: 'document', content: data.text };
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
