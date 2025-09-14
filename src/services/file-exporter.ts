
import { ChatSession, Message } from '@/lib/types';
import * as XLSX from 'xlsx';

const getMessageContent = (message: Message): string => {
  if (message.textContent) return message.textContent;
  if (typeof message.content === 'string') return message.content.replace(/<[^>]*>?/gm, '');
  return '[Unsupported Content]';
}

export const exportToDocx = (chatSession: ChatSession): string => {
  const { messages } = chatSession;
  const content = messages
    .map((message) => {
      const role = message.role === 'user' ? 'You' : 'Bot';
      const messageContent = getMessageContent(message);
      if (messageContent === '[Unsupported Content]') return '';
      return `
        <div style="margin-bottom: 12px;">
          <p><strong>${role}</strong></p>
          <p>${messageContent.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${chatSession.title}</title>
      </head>
      <body>
        <h1>${chatSession.title}</h1>
        ${content}
      </body>
    </html>
  `;
};

export const exportToXlsx = (chatSession: ChatSession): Buffer => {
  const { messages } = chatSession;
  const data = messages
    .map((message) => ({
      Role: message.role === 'user' ? 'You' : 'Bot',
      Content: getMessageContent(message),
      Timestamp: new Date(message.id).toLocaleString(),
    }))
    .filter(row => row.Content !== '[Unsupported Content]');

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Chat History');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};
