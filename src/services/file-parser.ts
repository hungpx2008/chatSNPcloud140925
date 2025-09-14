'use server';

import { fileTypeFromBuffer } from 'file-type';
import mammoth from 'mammoth';
import * as xlsx from 'xlsx';
import pdf from 'pdf-parse';

type ParsedContent = { type: 'image' | 'document' | 'audio'; content: string | null };

export async function extractTextFromFile(dataUri: string): Promise<ParsedContent> {
  const parts = dataUri.split(',');
  if (parts.length < 2) throw new Error('Invalid data URI.');
  const buffer = Buffer.from(parts[1]!, 'base64');

  // Prioritize server-side detection for accuracy. Fallback to client-provided mime.
  const detectedMime = (await fileTypeFromBuffer(buffer))?.mime;
  const dataUriMime = /^data:([^;,]+)[;,]/.exec(dataUri)?.[1];
  const mime: string | undefined = detectedMime ?? dataUriMime;

  if (mime?.startsWith('image/')) return { type: 'image', content: null };
  if (mime?.startsWith('audio/')) return { type: 'audio', content: null };

  if (mime === 'application/pdf') {
    try {
      const data = await pdf(buffer);
      return { type: 'document', content: data.text.trim() };
    } catch (err) {
      console.error('Error parsing PDF via pdf-parse', err);
      throw new Error('Could not parse PDF file.');
    }
  }

  if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const { value } = await mammoth.extractRawText({ buffer });
    return { type: 'document', content: value ?? '' };
  }

  if (mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    let fullText = '';
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const text = xlsx.utils.sheet_to_txt(worksheet);
      fullText += `Sheet: ${sheetName}\n\n${text}\n\n`;
    }
    return { type: 'document', content: fullText.trim() };
  }

  if (mime === 'text/plain') {
    return { type: 'document', content: buffer.toString('utf-8') };
  }

  // For unsupported or unknown mime types, default to treating it as a media file (image).
  // This allows the multimodal model to attempt to process it.
  if (mime) {
    console.warn(`Unsupported file type: ${mime}. Treating as a potential image or binary file.`);
  } else {
    console.warn('Could not determine file type. Defaulting to image/binary handling.');
  }

  return { type: 'image', content: null };
}