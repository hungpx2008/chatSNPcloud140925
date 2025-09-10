
"use client";

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export function Typewriter({ text, speed = 50 }: { text: string, speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    if (text) {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(intervalId);
        }
      }, speed);
      return () => clearInterval(intervalId);
    }
  }, [text, speed]);

  return <div className="prose prose-sm max-w-none"><ReactMarkdown>{displayedText}</ReactMarkdown></div>;
}
