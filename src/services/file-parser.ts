'use server';

import { fileTypeFromBuffer } from 'file-type';
import mammoth from 'mammoth';
import * as xlsx from 'xlsx';

type ParsedContent = { type: 'image' | 'document' | 'audio'; content: string | null };

export async function extractTextFromFile(dataUri: string): Promise<ParsedContent> {
  const parts = dataUri.split(',');
  if (parts.length < 2) throw new Error('Invalid data URI.');
  const buffer = Buffer.from(parts[1]!, 'base64');

  const dataUriMime = /^data:([^;,]+)[;,]/.exec(dataUri)?.[1];
  const detectedMime = (await fileTypeFromBuffer(buffer))?.mime;
  const mime: string | undefined = dataUriMime ?? detectedMime;

  if (mime?.startsWith('image/')) return { type: 'image', content: null };
  if (mime?.startsWith('audio/')) return { type: 'audio', content: null };

  if (mime === 'application/pdf') {
    try {
      const pdfjs = await import('pdfjs-dist'); // <— dùng package gốc
      const loadingTask = pdfjs.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;

      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((it: any) => it.str).join(' ') + '\n';
      }
      return { type: 'document', content: text.trim() };
    } catch (err) {
      console.error('Error parsing PDF via pdfjs-dist', err);
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

  if (mime === 'text/plain' || !mime) {
    return { type: 'document', content: buffer.toString('utf-8') };
  }

  console.warn(`Unsupported file type: ${mime}. Treating as a potential image or binary file.`);
  return { type: 'image', content: null };
}