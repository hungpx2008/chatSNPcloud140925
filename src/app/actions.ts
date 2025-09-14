'use server';

import { generateContent } from 'ai';
import {
  MultimodalHelpInput,
  getMultimodalHelp,
} from '@/ai/flows/multimodal-help';
import { geminiModel } from '@/ai/localClient';
import { exportToDocx, exportToXlsx } from '@/services/file-exporter';
import { ChatSession } from '@/lib/types';

const EXPORT_KEYWORDS = ['export', 'download', 'tải xuống', 'xuất file', 'tải về'];

function isExportRequest(question: string): boolean {
  const lowerQuestion = question.toLowerCase();
  return EXPORT_KEYWORDS.some(keyword => lowerQuestion.includes(keyword));
}

function createExportResponse(session: ChatSession): string {
    const docxHtml = exportToDocx(session);
    const docxBase64 = Buffer.from(docxHtml).toString('base64');
    const docxDataUri = `data:application/msword;base64,${docxBase64}`;

    const xlsxBuffer = exportToXlsx(session);
    const xlsxBase64 = xlsxBuffer.toString('base64');
    const xlsxDataUri = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${xlsxBase64}`;
    
    const docxFileName = `${session.title.replace(/[^a-z0-9]/gi, '_')}.doc`;
    const xlsxFileName = `${session.title.replace(/[^a-z0-9]/gi, '_')}.xlsx`;

    const responsePayload = {
        isExport: true,
        docx: {
            dataUri: docxDataUri,
            fileName: docxFileName,
        },
        xlsx: {
            dataUri: xlsxDataUri,
            fileName: xlsxFileName,
        }
    };

    return JSON.stringify(responsePayload);
}

export async function getHelp(
  question: string,
  department: string,
  session: ChatSession,
  photoDataUri?: string
) {
  if (isExportRequest(question)) {
    return createExportResponse(session);
  }

  try {
    const input: MultimodalHelpInput = {
      question,
      department,
      photoDataUri,
    };
    const { response } = await getMultimodalHelp(input);
    return JSON.stringify({ isExport: false, content: response });
  } catch (e: any) {
    console.error('[getHelp action failed]', e);
    return JSON.stringify({ isExport: false, content: `Sorry, I encountered an error. Please try again.` });
  }
}
