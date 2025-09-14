
import { ReactNode } from 'react';

export interface Message {
  id: number;
  role: 'user' | 'bot';
  content: string | ReactNode;
  textContent?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  department: string;
}
